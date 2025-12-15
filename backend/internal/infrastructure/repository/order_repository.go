package repository

import (
	"context"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/entity"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/repository"
	"gorm.io/gorm"
)

type orderRepository struct {
	db *gorm.DB
}

// NewOrderRepository は OrderRepository の実装を生成します
func NewOrderRepository(db *gorm.DB) repository.OrderRepository {
	return &orderRepository{db: db}
}

// FindAllByUserID は指定されたユーザーの注文を全て取得します
func (r *orderRepository) FindAllByUserID(ctx context.Context, userID string) ([]*entity.Order, error) {
	var orders []*entity.Order
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("created_at desc").Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}

// FindByID は指定されたIDの注文を取得します（注文明細を含む）
func (r *orderRepository) FindByID(ctx context.Context, id string) (*entity.Order, error) {
	var order entity.Order
	if err := r.db.WithContext(ctx).Preload("OrderItems").Preload("OrderItems.Product").First(&order, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

// Create は注文を作成します（注文明細も含む）
func (r *orderRepository) Create(ctx context.Context, order *entity.Order) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(order).Error; err != nil {
			return err
		}
		return nil
	})
}
