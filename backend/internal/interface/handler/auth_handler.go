package handler

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/usecase"
)

type AuthHandler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
	Logout(c *gin.Context)
	GetCurrentUser(c *gin.Context)
}

type authHandler struct {
	useCase usecase.AuthUseCase
}

// NewAuthHandler は AuthHandler の実装を生成します
func NewAuthHandler(u usecase.AuthUseCase) AuthHandler {
	return &authHandler{useCase: u}
}

// RegisterRequest は登録リクエストの構造体です
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest はログインリクエストの構造体です
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Register はユーザー登録のハンドラーです
func (h *authHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "入力内容が正しくありません"})
		return
	}

	user, err := h.useCase.Register(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// セッションにユーザーIDを保存
	session := sessions.Default(c)
	session.Set("user_id", user.ID)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "セッションの保存に失敗しました"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "登録が完了しました",
		"user":    user,
	})
}

// Login はログインのハンドラーです
func (h *authHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "入力内容が正しくありません"})
		return
	}

	user, err := h.useCase.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// セッションにユーザーIDを保存
	session := sessions.Default(c)
	session.Set("user_id", user.ID)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "セッションの保存に失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "ログインに成功しました",
		"user":    user,
	})
}

// Logout はログアウトのハンドラーです
func (h *authHandler) Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ログアウトに失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "ログアウトしました",
	})
}

// GetCurrentUser は現在のログインユーザー情報を取得するハンドラーです
func (h *authHandler) GetCurrentUser(c *gin.Context) {
	// ミドルウェアでセットされたユーザー情報を取得
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "ログインしていません"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
