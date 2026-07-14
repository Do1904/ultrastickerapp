# Football Sticker Map Japan (UltraSticker)

日本全国に貼られている海外フットボールクラブのステッカーを記録・共有し、日本国内における海外クラブファンの分布や勢力図を可視化するWebアプリ。

## 構成

```
ultrastickerapp/
├── myNewApp/       # Frontend: Angular 18 (Standalone Components) + Angular Material + Leaflet
├── ultrasticker/   # Backend: Node.js + Express + MySQL (mysql2)
├── mobile/         # Mobile: Capacitor (iOS/Android) — myNewAppのビルドを共有 (詳細は mobile/README.md)
└── docs/           # スキーマ・設計資料
```

## セットアップ

### Backend

```bash
cd ultrasticker
cp .env.example .env   # DB接続情報を設定
yarn install
yarn dev               # http://localhost:3000
```

### Frontend

```bash
cd myNewApp
yarn install
yarn start             # http://localhost:4200
```

## 主な機能

- **地図表示**: トップページ = 地図(Leaflet、初期表示は日本全体)
- **ステッカー投稿**: 写真アップロード → Exif GPSから位置自動取得(なければ地図クリックで指定)→ 国/リーグ/クラブ選択 → コメント(任意)
- **マーカー**: クリックで写真・クラブ・リーグ・国・投稿日時・投稿者・コメントを表示
- **フィルター**: 国 / リーグ / クラブで絞り込み(画面左)
- **地域検索**: Nominatimによる住所検索で地図移動(画面左)
- **エリアランキング**: 表示中の地図範囲内のクラブ別投稿数(画面右、地図移動で自動更新)
- **クラブ別統計**: 投稿数・最新投稿・クリックでそのクラブのピンにズーム
- **都道府県ランキング**: 都道府県ごとの投稿数と最多クラブ(★表示)
- **ヒートマップ**: 投稿密度をヒートマップ表示(クラブフィルター対応、自前Canvas実装)
- **勢力図**: メッシュ単位(約5km)で最多投稿クラブをクラブカラーで色分け + 都道府県単位の勢力図レイヤー

## API概要 (Backend)

| Method | Path | 説明 |
|---|---|---|
| GET | `/maps/getAllPins?countryId=&leagueId=&clubId=` | 地図用ピン一覧(フィルター対応、詳細情報込み) |
| POST | `/putStickers/putNewSticker` | 投稿(multipart: 写真+位置+クラブ+コメント) |
| GET | `/stickers/sticker/:id` | 投稿詳細 |
| GET | `/stats/clubs` | クラブ別統計(投稿数・最新投稿) |
| GET | `/stats/ranking?minLat=&minLng=&maxLat=&maxLng=` | 範囲内ランキング |
| GET | `/stats/prefectures` | 都道府県×クラブ集計 |
| GET | `/stats/heatmap?clubId=` | ヒートマップ用座標+都道府県密度 |
| GET | `/stats/territory?cell=0.05` | メッシュ勢力図(支配クラブ) |
| GET | `/stats/territory/cities` | 市区町村単位の勢力図 |
| POST | `/cheers/sendCheers` ほか | いいね(cheers) |
| POST | `/comments/postComment` ほか | コメント |

## データベース

既存MySQL (`stickers`) を利用。スキーマは `docs/schema.sql` 参照。

- 投稿コメントは `comments` テーブルに `first_flag=1` で保存(stickersにコメント列は追加しない)
- 住所は `addresses` の複合UNIQUEキーを利用した `INSERT ... ON DUPLICATE KEY UPDATE` で採番(system_paramsによる手動採番は廃止)
- 座標は `stickers.coordinate` (POINT型、`POINT(lng lat)` 順)

## 実装メモ

- クラブ/リーグ/国マスタはフロントエンド `myNewApp/src/app/const/club.ts` に定義
- Exif GPS抽出 (`util/exif-gps.ts`) とヒートマップ (`util/heat-layer.ts`) は依存パッケージなしの自前実装
- DB接続情報は `ultrasticker/.env` で管理(gitignore済み)
- 認証は未実装(userId=1固定)。将来の認証導入時は `putSticker.ts` / `cheers.ts` / `comments.ts` のTODOを置換

## 将来の拡張ポイント

- AIクラブ自動判定 / 重複判定: 投稿APIが `id` を返すため後段処理を追加しやすい
- フォロー・通知・タイムライン: usersテーブルの `role` / `auth_provider` が既に存在
- PWA: Angular `@angular/pwa` schematic追加で対応可能
