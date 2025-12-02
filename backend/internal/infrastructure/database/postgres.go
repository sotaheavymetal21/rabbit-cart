package database

import (
	"log"

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

	return db, nil
}
