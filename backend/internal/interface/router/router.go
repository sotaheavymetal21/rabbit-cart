package router

import (
	"log"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/interface/handler"
)

// SetupRouter は Gin のルーターをセットアップします
func SetupRouter(
	productHandler handler.ProductHandler,
	authHandler handler.AuthHandler,
	orderHandler handler.OrderHandler,
	redisURL string,
	sessionSecret string,
	authMiddleware gin.HandlerFunc,
) *gin.Engine {
	r := gin.Default()

	// Redis セッションストアの設定
	// redisURL の形式: "host:port" (例: "redis:6379")
	parts := strings.Split(redisURL, ":")
	if len(parts) != 2 {
		log.Fatal("REDIS_URL の形式が正しくありません (host:port)")
	}
	store, err := redis.NewStore(10, "tcp", redisURL, "", "", []byte(sessionSecret))
	if err != nil {
		log.Fatalf("Redis セッションストアの初期化に失敗しました: %v", err)
	}
	r.Use(sessions.Sessions("rabbit_cart_session", store))

	// CORS 設定
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// ヘルスチェック
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// API v1 グループ
	v1 := r.Group("/api/v1")
	{
		// 認証エンドポイント (認証不要)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
			auth.GET("/me", authMiddleware, authHandler.GetCurrentUser)
		}

		// 商品エンドポイント (認証不要)
		products := v1.Group("/products")
		{
			products.GET("", productHandler.GetProducts)
			products.GET("/:id", productHandler.GetProduct)
		}

		// 注文エンドポイント (要認証)
		orders := v1.Group("/orders")
		orders.Use(authMiddleware)
		{
			orders.GET("", orderHandler.GetOrders)
			orders.GET("/:id", orderHandler.GetOrder)
			orders.POST("", orderHandler.CreateOrder)
		}
	}

	return r
}
