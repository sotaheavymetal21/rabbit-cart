package middleware

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/repository"
)

// AuthMiddleware は認証が必要なエンドポイントで使用するミドルウェアです
func AuthMiddleware(userRepo repository.UserRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		userID := session.Get("user_id")

		// セッションにユーザーIDが存在しない場合
		if userID == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ログインが必要です"})
			c.Abort()
			return
		}

		// ユーザー情報を取得
		user, err := userRepo.FindByID(c.Request.Context(), userID.(string))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ユーザーが見つかりません"})
			c.Abort()
			return
		}

		// コンテキストにユーザー情報をセット
		c.Set("user", user)
		c.Next()
	}
}
