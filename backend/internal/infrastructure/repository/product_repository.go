package repository

import (
	"context"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/entity"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/repository"
	"gorm.io/gorm"
)

type productRepository struct {
	db *gorm.DB
}

// NewProductRepository は ProductRepository の実装を生成します
func NewProductRepository(db *gorm.DB) repository.ProductRepository {
	return &productRepository{db: db}
}

// FindAll は全ての商品を取得します
func (r *productRepository) FindAll(ctx context.Context) ([]*entity.Product, error) {
	var products []*entity.Product
	// GORM を使用して全件取得
	if err := r.db.WithContext(ctx).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

// FindByID は指定されたIDの商品を取得します
func (r *productRepository) FindByID(ctx context.Context, id string) (*entity.Product, error) {
	var product entity.Product
	// GORM を使用してID検索
	if err := r.db.WithContext(ctx).First(&product, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}
