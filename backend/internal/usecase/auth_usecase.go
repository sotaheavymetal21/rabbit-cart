package usecase

import (
	"context"
	"errors"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/entity"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AuthUseCase は認証に関するビジネスロジックを定義するインターフェースです
type AuthUseCase interface {
	Register(ctx context.Context, email, password string) (*entity.User, error)
	Login(ctx context.Context, email, password string) (*entity.User, error)
}

type authUseCase struct {
	userRepo repository.UserRepository
}

// NewAuthUseCase は AuthUseCase の実装を生成します
func NewAuthUseCase(userRepo repository.UserRepository) AuthUseCase {
	return &authUseCase{userRepo: userRepo}
}

// Register は新しいユーザーを登録します
func (u *authUseCase) Register(ctx context.Context, email, password string) (*entity.User, error) {
	// メールアドレスの重複チェック
	_, err := u.userRepo.FindByEmail(ctx, email)
	if err == nil {
		return nil, errors.New("このメールアドレスは既に登録されています")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// パスワードのハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &entity.User{
		Email:        email,
		PasswordHash: string(hashedPassword),
	}

	// ユーザーの作成
	if err := u.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

// Login はユーザーのログイン処理を行います
func (u *authUseCase) Login(ctx context.Context, email, password string) (*entity.User, error) {
	// ユーザーの検索
	user, err := u.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("メールアドレスまたはパスワードが正しくありません")
		}
		return nil, err
	}

	// パスワードの検証
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, errors.New("メールアドレスまたはパスワードが正しくありません")
	}

	return user, nil
}
