package repository

import (
	"context"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/entity"
)

// ProductRepository は商品データへのアクセスを抽象化するインターフェースです
type ProductRepository interface {
	// FindAll は全ての商品を取得します
	FindAll(ctx context.Context) ([]*entity.Product, error)
	// FindByID は指定されたIDの商品を取得します
	FindByID(ctx context.Context, id string) (*entity.Product, error)
}
