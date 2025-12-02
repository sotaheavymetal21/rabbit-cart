package entity

import (
	"time"
)

// Product は商品を表すエンティティです
type Product struct {
	ID          string    `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Price       int       `json:"price"`
	Stock       int       `json:"stock"`
	ImageURL    string    `json:"image_url"`
	Category    string    `json:"category"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// TableName はテーブル名を指定します
func (Product) TableName() string {
	return "products"
}
