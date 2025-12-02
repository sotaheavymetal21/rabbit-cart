package entity

import (
	"time"
)

// User はユーザーを表すエンティティです
type User struct {
	ID           string    `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Email        string    `json:"email" gorm:"unique;not null"`
	PasswordHash string    `json:"-" gorm:"not null"` // パスワードハッシュはJSON出力しない
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// TableName はテーブル名を指定します
func (User) TableName() string {
	return "users"
}
