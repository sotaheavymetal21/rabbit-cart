package repository

import (
	"context"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/entity"
)

// OrderRepository は注文データへのアクセスを抽象化するインターフェースです
type OrderRepository interface {
	// FindAllByUserID は指定されたユーザーの注文を全て取得します
	FindAllByUserID(ctx context.Context, userID string) ([]*entity.Order, error)
	// FindByID は指定されたIDの注文を取得します（注文明細を含む）
	FindByID(ctx context.Context, id string) (*entity.Order, error)
	// Create は注文を作成します（注文明細も含む）
	Create(ctx context.Context, order *entity.Order) error
}
