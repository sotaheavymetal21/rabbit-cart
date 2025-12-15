package database

import (
	"log"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/domain/entity"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewPostgresDB(dbUrl string) (*gorm.DB, error) {
	if dbUrl == "" {
		log.Fatal("DB_URL が設定されていません")
	}

	db, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto Migration
	if err := db.AutoMigrate(
		&entity.User{},
		&entity.Product{},
		&entity.Order{},
		&entity.OrderItem{},
	); err != nil {
		return nil, err
	}

	return db, nil
}
