package router

import (
	"github.com/gin-gonic/gin"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/interface/handler"
)

// SetupRouter は Gin のルーターをセットアップします
func SetupRouter(productHandler handler.ProductHandler) *gin.Engine {
	r := gin.Default()

	// CORS 設定 (必要に応じて調整)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
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
		products := v1.Group("/products")
		{
			products.GET("", productHandler.GetProducts)
			products.GET("/:id", productHandler.GetProduct)
		}
	}

	return r
}
