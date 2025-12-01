export default function Footer() {
  return (
    // フッター全体: 背景色を薄いグレー、上部にマージン（mt-autoで最下部に配置）
    <footer className="bg-gray-100 py-8 mt-auto">
      {/* コンテンツコンテナ: 中央揃え */}
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>&copy; 2024 rabbit-cart. All rights reserved. 🐰</p>
      </div>
    </footer>
  )
}
