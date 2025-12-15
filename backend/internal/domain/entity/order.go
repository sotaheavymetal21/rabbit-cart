package entity

import (
	"time"
)

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusCompleted OrderStatus = "completed"
	OrderStatusCancelled OrderStatus = "cancelled"
)

// Order は注文を表すエンティティです
type Order struct {
	ID          string      `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	UserID      string      `json:"user_id" gorm:"type:uuid;not null"`
	TotalAmount int         `json:"total_amount" gorm:"not null"`
	Status      OrderStatus `json:"status" gorm:"type:varchar(20);default:'pending';not null"`
	Address     string      `json:"address" gorm:"type:jsonb;not null"` // JSON serialized string
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
	OrderItems  []OrderItem `json:"order_items" gorm:"foreignKey:OrderID"`
}

// TableName はテーブル名を指定します
func (Order) TableName() string {
	return "orders"
}
