# ビルドステージ
FROM golang:1.24-alpine AS builder

WORKDIR /app

# 依存関係のダウンロード
COPY go.mod go.sum ./
RUN go mod download

# ソースコードのコピー
COPY . .

# ビルド
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api/main.go

# 実行ステージ
FROM alpine:latest

WORKDIR /root/

# ビルドステージからバイナリをコピー
COPY --from=builder /app/main .

# ポートの公開
EXPOSE 8080

# アプリケーションの実行
CMD ["./main"]
