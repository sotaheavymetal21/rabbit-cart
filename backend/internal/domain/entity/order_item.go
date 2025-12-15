package entity

import (
	"time"
)

// OrderItem は注文明細を表すエンティティです
type OrderItem struct {
	ID        string    `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	OrderID   string    `json:"order_id" gorm:"type:uuid;not null"`
	ProductID string    `json:"product_id" gorm:"type:uuid;not null"`
	Quantity  int       `json:"quantity" gorm:"not null"`
	Price     int       `json:"price" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`
	Product   Product   `json:"product" gorm:"foreignKey:ProductID"`
}

// TableName はテーブル名を指定します
func (OrderItem) TableName() string {
	return "order_items"
}
