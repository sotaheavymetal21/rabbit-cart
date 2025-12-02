package usecase

import (
	"context"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/entity"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/repository"
)

// ProductUseCase は商品に関するビジネスロジックを定義するインターフェースです
type ProductUseCase interface {
	GetAllProducts(ctx context.Context) ([]*entity.Product, error)
	GetProductByID(ctx context.Context, id string) (*entity.Product, error)
}

type productUseCase struct {
	repo repository.ProductRepository
}

// NewProductUseCase は ProductUseCase の実装を生成します
func NewProductUseCase(repo repository.ProductRepository) ProductUseCase {
	return &productUseCase{repo: repo}
}

// GetAllProducts は全ての商品を取得します
func (u *productUseCase) GetAllProducts(ctx context.Context) ([]*entity.Product, error) {
	return u.repo.FindAll(ctx)
}

// GetProductByID は指定されたIDの商品を取得します
func (u *productUseCase) GetProductByID(ctx context.Context, id string) (*entity.Product, error) {
	return u.repo.FindByID(ctx, id)
}
