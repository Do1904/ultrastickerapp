---
name: frontend-patterns
description: myNewApp (Angular 18) のフロントエンド実装規約。コンポーネント作成、サービス追加、API呼び出し、マスタデータ(クラブ/リーグ/国)の扱い、フォーム、スタイリング、SSR対応が絡む作業では必ず読むこと。特にLeafletやwindow/navigator等のブラウザAPIを使うコードを書く前に読まないとSSRビルドが壊れる。
---

# Frontend 開発ガイド (myNewApp/)

## 基本規約

- **全コンポーネントはStandalone**(`standalone: true` + `imports: [...]`)。NgModuleは作らない。
- DIは `inject()` 関数とコンストラクタ注入が混在。新規コードはどちらでも良いが1ファイル内では統一。
- HTTP呼び出しは **axios** が主流(サービス内 async/await)。HttpClientはgeojson読み込み等に少数残存。
  新規APIサービスはaxiosパターンを踏襲する。
- APIのURLは **必ず `const/api.ts` の `API_BASE`** を使う。URLをハードコードしない
  (Capacitorネイティブ実行時にLAN IPへ切り替わる仕組みがあるため)。

## ⚠ SSR対応(最重要)

SSR+プリレンダーが有効。ブラウザAPI(`window`/`document`/`navigator`/Leaflet)を使うコードは:

```ts
async ngAfterViewInit(): Promise<void> {
  if (typeof window === 'undefined') return;   // サーバー側では何もしない
  const L = await import('leaflet');           // Leafletは必ず動的import
  ...
}
```

- **Leafletをトップレベルで `import * as L from 'leaflet'` しない**(UMDがwindowを触って落ちる)。
  型だけ必要なら `import type * as Leaflet from 'leaflet'` はOK。
- IndexedDB/localStorage も同様にガードする(`draft.service.ts` 参照)。

## マスタデータ(クラブ/リーグ/国)

- 定義: `const/club.ts`(COUNTRIES / LEAGUES / CLUBS)。DBにはIDのみ。
- 高速参照: `const/clubMaps.ts` の `countryMap` / `leagueMap` / `clubMap`(Map<id, ...>)。
- **ID採番規則**: `leagueId = countryId*1000 + 連番`、`clubId = leagueId*1000 + 連番`。
  例: England(1) → Premier League(1001) → Arsenal(1001001)。
  クラブ追加時はこの規則に従い、`color1`/`color2`(クラブカラー。マーカーや勢力図の色)も必ず設定する。
- countryId 99 / leagueId 9999 / clubId 999901 はテスト用。UIのセレクトでは除外する
  (`COUNTRIES.filter(c => c.countryId !== 99)` パターン)。
- 国→リーグ→クラブのカスケード選択は map.component / sticker-form.component の
  `onCountryChange/onLeagueChange` パターンをコピーする。

## サービス一覧(車輪の再発明防止)

| サービス | 役割 |
|---|---|
| `map.service` | 地図ピン取得(フィルター対応、Pin型へ整形) |
| `stats.service` | 統計API(clubs/ranking/prefectures/heatmap/territory) |
| `location.service` | Nominatim検索・逆ジオコーディング・現在地取得 |
| `putsticker.service` | 投稿(FormData)・更新・削除 |
| `sticker.service` / `cheers.service` / `comments.service` | 一覧・詳細・いいね・コメント |
| `draft.service` | オフライン下書き(IndexedDB、写真Blobごと保存) |

## ユーティリティ

- `util/exif-gps.ts` — JPEG ExifからGPS抽出(自前実装・依存なし)。写真から位置を得るときはこれ。
- `util/heat-layer.ts` — Canvasヒートマップレイヤー(leaflet.heat相当・自前実装)。

## Nominatim(OpenStreetMap)利用規約

- 検索は `countrycodes=jp&limit=5&accept-language=ja` を付ける。
- 逆ジオコーディングの都道府県は `address.province || address.state || isoToPrefecture[...]` の順で解決
  (`const/prefecture.ts`)。
- 商用制限・レート制限(1req/s)があるため、連打されるUIにはdebounceを入れる。

## スタイリング

- テーマ: モノトーン(黒 #111114 / 白)。黄色などの有彩色アクセントは使わない。`ultrasticker-architecture` スキルのテーマ節を参照。
- ステッカー風フリップカードは `src/sticker.css` を styleUrls に追加して `.sticker` 構造を使う。
- Angular Material は form-field / select / input / button / icon を使用中。
  overlayパネル内では `appearance="outline"` を使う。
- 固定ヘッダー52px。全画面レイアウトは `calc(100vh - 52px)`。
- レスポンシブは各コンポーネントCSSの `@media (max-width: ...)` で個別対応。

## フォームの作法

- シンプルな入力は `FormsModule` + `[(ngModel)]`(sticker-form)。details画面はReactiveForms。
- 投稿フォームの必須検証は `get canSubmit()` のようなgetterで宣言的に書き、ボタンの `[disabled]` に束ねる。
