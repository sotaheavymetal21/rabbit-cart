# Makefile for rabbit-cart project
# Docker Compose を使った開発環境の管理

.PHONY: help build up down restart logs shell clean ps install dev prod stop

# デフォルトターゲット: ヘルプを表示
help:
	@echo "使用可能なコマンド:"
	@echo "  make build      - Dockerイメージをビルド"
	@echo "  make up         - コンテナを起動（デタッチモード）"
	@echo "  make down       - コンテナを停止して削除"
	@echo "  make restart    - コンテナを再起動"
	@echo "  make logs       - コンテナのログを表示（フォロー）"
	@echo "  make shell      - アプリケーションコンテナに入る"
	@echo "  make ps         - 実行中のコンテナを表示"
	@echo "  make clean      - コンテナ、ボリューム、イメージを削除"
	@echo "  make install    - 依存関係をインストール"
	@echo "  make dev        - 開発サーバーを起動（ログ表示）"
	@echo "  make stop       - コンテナを停止（削除しない）"
	@echo "  make rebuild    - クリーンビルド（キャッシュなし）"
	@echo "  make cache-clear - Next.jsのキャッシュをクリア"

# Dockerイメージをビルド
build:
	docker compose build

# コンテナを起動（デタッチモード）
up:
	docker compose up -d

# コンテナを停止して削除
down:
	docker compose down

# コンテナを再起動
restart:
	docker compose restart

# コンテナのログを表示（フォロー）
logs:
	docker compose logs -f

# アプリケーションコンテナのログのみ表示
logs-app:
	docker compose logs -f app

# アプリケーションコンテナに入る（シェル）
shell:
	docker compose exec app sh

# 実行中のコンテナを表示
ps:
	docker compose ps

# コンテナを停止（削除しない）
stop:
	docker compose stop

# コンテナ、ボリューム、ネットワーク、イメージをすべて削除
clean:
	docker compose down -v --rmi all --remove-orphans

# キャッシュを使わずにクリーンビルド
rebuild:
	docker compose build --no-cache

# 依存関係をインストール（コンテナ内で実行）
install:
	docker compose exec app pnpm install

# 開発サーバーを起動（ログ表示）
dev: up logs

# Next.jsのキャッシュをクリア
cache-clear:
	docker compose exec app rm -rf .next
	@echo "Next.jsキャッシュをクリアしました"

# コンテナを再ビルドして起動
up-build:
	docker compose up -d --build

# すべてのコンテナを停止し、キャッシュをクリアして再起動
fresh: down cache-clear up

# pnpmコマンドを実行（例: make pnpm CMD="add axios"）
pnpm:
	docker compose exec app pnpm $(CMD)

# Next.jsのビルドを実行
build-next:
	docker compose exec app pnpm build

# プロダクションモードで起動
prod:
	docker compose exec app pnpm start
