package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/usecase"
)

type ProductHandler interface {
	GetProducts(c *gin.Context)
	GetProduct(c *gin.Context)
}

type productHandler struct {
	useCase usecase.ProductUseCase
}

// NewProductHandler は ProductHandler の実装を生成します
func NewProductHandler(u usecase.ProductUseCase) ProductHandler {
	return &productHandler{useCase: u}
}

// GetProducts は商品一覧を取得するハンドラーです
func (h *productHandler) GetProducts(c *gin.Context) {
	products, err := h.useCase.GetAllProducts(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "商品の取得に失敗しました"})
		return
	}
	c.JSON(http.StatusOK, products)
}

// GetProduct は指定されたIDの商品を取得するハンドラーです
func (h *productHandler) GetProduct(c *gin.Context) {
	id := c.Param("id")
	product, err := h.useCase.GetProductByID(c.Request.Context(), id)
	if err != nil {
		// エラーの種類によってステータスコードを変えるべきだが、簡単のため500または404とする
		// 実際にはリポジトリ層でエラー判定を行うのが望ましい
		c.JSON(http.StatusInternalServerError, gin.H{"error": "商品の取得に失敗しました"})
		return
	}
	if product == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "商品が見つかりません"})
		return
	}
	c.JSON(http.StatusOK, product)
}
