package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBUrl         string
	RedisURL      string
	Port          string
	SessionSecret string
}

func LoadConfig() *Config {
	// .env ファイルが存在する場合は読み込む
	if err := godotenv.Load("../.env"); err != nil {
		if err := godotenv.Load(); err != nil {
			log.Println(".env ファイルが見つかりませんでした。環境変数を使用します。")
		}
	}

	sessionSecret := os.Getenv("SESSION_SECRET")
	if sessionSecret == "" {
		log.Fatal("SESSION_SECRET が設定されていません")
	}

	return &Config{
		DBUrl:         os.Getenv("DB_URL"),
		RedisURL:      os.Getenv("REDIS_URL"),
		Port:          getEnv("PORT", "8080"),
		SessionSecret: sessionSecret,
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
