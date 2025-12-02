package main

import (
	"log"

	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/infrastructure/database"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/infrastructure/middleware"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/infrastructure/repository"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/interface/handler"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/interface/router"
	"github.com/sotaheavymetal21/rabbit-cart/backend/internal/usecase"
	"github.com/sotaheavymetal21/rabbit-cart/backend/pkg/config"
)

func main() {
	cfg := config.LoadConfig()

	log.Println("データベースに接続しています...")
	db, err := database.NewPostgresDB(cfg.DBUrl)
	if err != nil {
		log.Fatalf("データベースへの接続に失敗しました: %v", err)
	}
	log.Println("データベースへの接続に成功しました！")

	// 依存関係の注入 (Dependency Injection)
	// Repository
	productRepo := repository.NewProductRepository(db)
	userRepo := repository.NewUserRepository(db)

	// UseCase
	productUseCase := usecase.NewProductUseCase(productRepo)
	authUseCase := usecase.NewAuthUseCase(userRepo)

	// Handler
	productHandler := handler.NewProductHandler(productUseCase)
	authHandler := handler.NewAuthHandler(authUseCase)

	// Middleware
	authMiddleware := middleware.AuthMiddleware(userRepo)

	// ルーターのセットアップ
	r := router.SetupRouter(productHandler, authHandler, cfg.RedisURL, cfg.SessionSecret, authMiddleware)

	log.Printf("サーバーをポート %s で起動しています...", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("サーバーの起動に失敗しました: %v", err)
	}
}
