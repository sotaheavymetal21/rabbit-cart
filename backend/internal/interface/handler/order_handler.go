package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/usecase"
)

type OrderHandler interface {
	GetOrders(c *gin.Context)
	GetOrder(c *gin.Context)
	CreateOrder(c *gin.Context)
}

type orderHandler struct {
	useCase usecase.OrderUseCase
}

func NewOrderHandler(u usecase.OrderUseCase) OrderHandler {
	return &orderHandler{useCase: u}
}

func (h *orderHandler) GetOrders(c *gin.Context) {
	// AuthMiddlewareでセットされたUserIDを取得
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "認証されていません"})
		return
	}

	orders, err := h.useCase.GetOrdersByUserID(c.Request.Context(), userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "注文履歴の取得に失敗しました"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func (h *orderHandler) GetOrder(c *gin.Context) {
	id := c.Param("id")
	// Note: 厳密には UserID もチェックして、自分の注文か確認すべき
	// UseCase で UserID を渡してフィルタリングするか、ここでチェックするか
	// UseCase の GetOrderByID は現状 ID のみで取得しているため、セキュリティ的には UserID も渡すべきだが、今回は省略

	order, err := h.useCase.GetOrderByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "注文の取得に失敗しました"})
		return
	}

	// 簡易的な権限チェック
	userID, exists := c.Get("userID")
	if !exists || order.UserID != userID.(string) {
		c.JSON(http.StatusForbidden, gin.H{"error": "この注文を閲覧する権限がありません"})
		return
	}

	c.JSON(http.StatusOK, order)
}

func (h *orderHandler) CreateOrder(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "認証されていません"})
		return
	}

	var input usecase.CreateOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "入力データが不正です: " + err.Error()})
		return
	}

	order, err := h.useCase.CreateOrder(c.Request.Context(), userID.(string), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "注文の作成に失敗しました: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, order)
}
