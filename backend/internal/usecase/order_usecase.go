package usecase

import (
	"context"
	"errors"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/entity"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/repository"
)

// OrderUseCase は注文に関するビジネスロジックを定義するインターフェースです
type OrderUseCase interface {
	GetOrdersByUserID(ctx context.Context, userID string) ([]*entity.Order, error)
	GetOrderByID(ctx context.Context, id string) (*entity.Order, error)
	CreateOrder(ctx context.Context, userID string, input CreateOrderInput) (*entity.Order, error)
}

type CreateOrderInput struct {
	Address string            `json:"address"`
	Items   []CreateOrderItem `json:"items"`
}

type CreateOrderItem struct {
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
}

type orderUseCase struct {
	orderRepo   repository.OrderRepository
	productRepo repository.ProductRepository
}

// NewOrderUseCase は OrderUseCase の実装を生成します
func NewOrderUseCase(orderRepo repository.OrderRepository, productRepo repository.ProductRepository) OrderUseCase {
	return &orderUseCase{
		orderRepo:   orderRepo,
		productRepo: productRepo,
	}
}

func (u *orderUseCase) GetOrdersByUserID(ctx context.Context, userID string) ([]*entity.Order, error) {
	return u.orderRepo.FindAllByUserID(ctx, userID)
}

func (u *orderUseCase) GetOrderByID(ctx context.Context, id string) (*entity.Order, error) {
	return u.orderRepo.FindByID(ctx, id)
}

func (u *orderUseCase) CreateOrder(ctx context.Context, userID string, input CreateOrderInput) (*entity.Order, error) {
	if len(input.Items) == 0 {
		return nil, errors.New("注文商品が含まれていません")
	}

	var totalAmount int
	var orderItems []entity.OrderItem

	// 各商品の価格を取得して注文明細を作成
	for _, item := range input.Items {
		product, err := u.productRepo.FindByID(ctx, item.ProductID)
		if err != nil {
			return nil, err // 商品が存在しない場合など
		}
		if product.Stock < item.Quantity {
			return nil, errors.New("在庫不足の商品があります: " + product.Name)
		}

		price := product.Price
		subtotal := price * item.Quantity
		totalAmount += subtotal

		orderItems = append(orderItems, entity.OrderItem{
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     price,
		})
	}

	// Address validation/serialization if needed. Input is already string (JSON from frontend).
	// But Address in DB is just string for now.
	// We might want to clear whitespace or validate it's valid JSON if we cared.

	order := &entity.Order{
		UserID:      userID,
		TotalAmount: totalAmount,
		Status:      entity.OrderStatusPending,
		Address:     input.Address,
		OrderItems:  orderItems,
	}

	if err := u.orderRepo.Create(ctx, order); err != nil {
		return nil, err
	}

	return order, nil
}
