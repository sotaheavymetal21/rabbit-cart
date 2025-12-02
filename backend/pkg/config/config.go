package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBUrl     string
	JWTSecret string
	Port      string
}

func LoadConfig() *Config {
	// .env ファイルが存在する場合は読み込む
	// バイナリが実行される場所によってパスが異なる可能性があるため、
	// 親ディレクトリの .env も確認する（ローカル開発用）

	// ../.env (backend/ から見た相対パス) を試行
	if err := godotenv.Load("../.env"); err != nil {
		// カレントディレクトリを確認
		if err := godotenv.Load(); err != nil {
			log.Println(".env ファイルが見つかりませんでした。環境変数を使用します。")
		}
	}

	return &Config{
		DBUrl:     os.Getenv("DB_URL"),
		JWTSecret: os.Getenv("SUPABASE_JWT_SECRET"), // 環境変数名は既存のものを利用するが、コード内では汎用的に扱う
		Port:      getEnv("PORT", "8080"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
