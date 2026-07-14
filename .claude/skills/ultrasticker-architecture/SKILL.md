---
name: ultrasticker-architecture
description: Football Sticker Map Japan (UltraSticker) リポジトリの全体像・起動方法・設計判断の基礎知識。このリポジトリで何か作業を始めるとき(機能追加、バグ修正、リファクタリング、質問への回答を問わず)は必ず最初にこのスキルを読むこと。「どこに何があるか」「なぜこの設計か」に迷ったときも参照する。
---

# UltraSticker アーキテクチャガイド

## プロダクトの目的

日本の公共空間(電柱・壁・標識等)に貼られた海外フットボールクラブのステッカーを写真+位置情報で記録し、
**日本国内の海外クラブファン文化を地図上の「勢力図」として可視化する**サービス。
単なる写真共有ではない。機能追加の判断に迷ったら「勢力図の可視化に寄与するか」を基準にする。

## リポジトリ構成

```
ultrastickerapp/
├── myNewApp/       # Frontend: Angular 18 Standalone + Angular Material + Leaflet + axios
├── ultrasticker/   # Backend: Express + mysql2 (ESM, TypeScript, ts-node/esm)
├── mobile/         # Capacitor シェル (iOS/Android)。myNewAppのビルドを共有
├── docs/           # schema.sql (DBスキーマのダンプ), er.plantuml (古い。信用しない)
└── .claude/skills/ # このスキルライブラリ
```

## 起動方法

```bash
# Backend (http://localhost:3000)
cd ultrasticker && yarn dev        # nodemon + ts-node/esm。.env が必要(.env.example参照)

# Frontend (http://localhost:4200)
cd myNewApp && yarn start          # ng serve
```

## ルーティング(フロントエンド)

| パス | コンポーネント | 内容 |
|---|---|---|
| `/` | MapComponent | **トップ=地図**。左に検索/フィルター、右に統計パネル |
| `/about` | TopComponent | コンセプト紹介ページ(旧トップ) |
| `/allStickers` | StickerComponent | ステッカーギャラリー |
| `/details/:id` | DetailsComponent | 投稿詳細(cheers・コメント) |
| `/putSticker` | StickerFormComponent | 投稿フォーム(カメラ/Exif GPS/下書き) |
| `/map` | → `/` へリダイレクト | 後方互換 |

## 重要な設計判断(変更前に必ず理解すること)

1. **クラブ/リーグ/国のマスタデータはDBに存在しない。**
   `myNewApp/src/app/const/club.ts` にハードコードされ、DBにはIDのみ保存される。
   バックエンドはIDを解決できないため、名前解決は常にフロントエンドで行う。

2. **依存パッケージ追加は最小限に。**
   Exif GPS抽出(`util/exif-gps.ts`)とヒートマップ(`util/heat-layer.ts`)は意図的に自前実装。
   モバイル(Capacitor)でもカメラ=`<input capture>`、GPS=`navigator.geolocation`、
   下書き=IndexedDB とWeb標準APIのみを使う方針。新しいnpm依存を足す前に標準APIで代替できないか検討する。

3. **座標は `POINT(経度 緯度)` の順で保存**(lng first!)。詳細は `backend-api` スキル参照。

4. **投稿コメントは stickers テーブルではなく comments テーブル(first_flag=1)。**
   stickersにコメント列を追加しないこと。詳細は `database-schema` スキル参照。

5. **認証は未実装。** 全ルートで `userId = 1` 固定(`// TODO` コメントあり)。
   認証を実装する場合は `putSticker.ts` / `cheers.ts` / `comments.ts` のTODOを一括で置換する。

6. **SSR(Angular Universal)が有効。** ブラウザAPIを使うコードには必ずガードが要る。
   詳細は `frontend-patterns` スキル参照。怠るとビルド時プリレンダーが落ちる。

## テーマ / デザイン言語

「ストリート/ステッカーカルチャー」。既存アセットを流用すること:

- ベースカラー: モノトーン。黒 #111114 × 白 #ffffff(アクセントも白。黄色は使わない)
- 背景テクスチャ: `assets/brick-wall.png`(レンガ)、`assets/concrete.png`(コンクリ)
- フリップするステッカーカード: `src/sticker.css` の `.sticker .sticker-container ...` 構造(共有CSS)。
  コンポーネントで使うには `styleUrls` に `'../../../sticker.css'` を追加する
- 固定ヘッダーは52px。全画面要素は `calc(100vh - 52px)` で高さを取る

## 各領域の詳細スキル

- API追加/変更 → `backend-api`
- DBスキーマ/データ規約 → `database-schema`
- Angular実装規約 → `frontend-patterns`
- 地図・統計・勢力図 → `map-and-stats`
- モバイルアプリ → `mobile-capacitor`
- 変更の検証方法 → `verification-and-testing`
