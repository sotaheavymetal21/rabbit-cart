package repository

import (
	"context"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/entity"
)

// UserRepository はユーザーデータへのアクセスを抽象化するインターフェースです
type UserRepository interface {
	// Create は新しいユーザーを作成します
	Create(ctx context.Context, user *entity.User) error
	// FindByEmail はメールアドレスでユーザーを検索します
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
	// FindByID はIDでユーザーを検索します
	FindByID(ctx context.Context, id string) (*entity.User, error)
}
