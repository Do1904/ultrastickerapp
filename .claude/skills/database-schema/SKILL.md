---
name: database-schema
description: MySQLデータベース(stickers)のスキーマ・データ規約・マイグレーション手順。テーブル構造の確認、カラム追加の検討、SQL作成、「このデータはどこに保存されている?」という疑問、コメント/いいね/住所/座標データを触る作業の前に必ず読むこと。スキーマを推測で書くとcomments.first_flagやaddresses.address_idの罠を踏む。
---

# データベースガイド (MySQL: stickers)

## 大原則

- **新しいテーブルは作らない。既存6テーブルを最大限使う。** どうしても必要なときのみユーザーに提案する。
- スキーマの正は `docs/schema.sql`(mysqldumpの実物)。ER図 `docs/er.plantuml` は**古いので信用しない**。
- Claude環境からDBには直接接続できないことが多い。スキーマ確認・データ移行SQLは
  ユーザーに実行してもらう(下記「スキーマの再確認」)。

## テーブル要約

| テーブル | 主キー | 役割・注意点 |
|---|---|---|
| `stickers` | id (bigint) | 投稿本体。`sticker`=写真URL、`club_id/league_id/country_id`(マスタはフロント)、`address_id`、`coordinate` POINT(lng lat)、`is_clean`、`created_at/updated_at` 自動 |
| `addresses` | address_id (AUTO_INC) | 逆ジオコーディング結果。(country,state,city,district,neighbourhood,postcode)に複合UNIQUE。**stateが都道府県**(統計の軸) |
| `comments` | id | `first_flag=1` が「投稿時コメント」、0がリプライ(`replying_comment_id`)。`status` enum('active','deleted','hidden')。FKでstickers/usersにCASCADE |
| `cheers` | (user_id, sticker_id) | いいね。複合主キーで重複防止 |
| `users` | id | `nickname` 表示名、`favclub`、認証系カラムあり(未使用) |
| `system_params` | param_key | 旧採番用。**latestAddressIdは廃止済み。新規用途で使わない** |

## データ規約

1. **投稿コメント = comments に first_flag=1**。stickersにコメント列を追加しない。
   投稿者のコメント取得は `WHERE sticker_id=? AND user_id=stickers.user_id AND first_flag=1 AND status='active'`。
2. **座標は POINT(経度 緯度)**。ST_X=lng, ST_Y=lat。詳細は `backend-api` スキル。
3. **住所は空文字で埋める**(NULLはUNIQUEをすり抜けるため)。挿入は必ず findOrCreateAddress 経由。
4. `addresses.state` は都道府県名(日本語、例「東京都」)。都道府県統計・GeoJSON照合(nam_ja)の結合キー。
   Nominatimが英語名を返した場合の正規化は `location.service.ts` の isoToPrefecture が担う。
5. IDの型がテーブル間で不揃い(int/bigint/mediumint等)だが動作する。FK追加時は型を合わせること。

## スキーマの再確認(ユーザーに依頼する)

```bash
cd /Users/ryotakondo/ultrastickerapp
mysqldump -u do1904 -p --no-data --no-tablespaces stickers > docs/schema.sql
```

「PROCESS privilege」エラーはtablespace部分のみの問題で、`--no-tablespaces` を付ければ消える
(付けなくてもテーブル定義は出力されている)。

## マイグレーション(カラム追加等)の手順

1. ALTER文を提案し、ユーザーに実行してもらう(直接実行はできない)。
2. 実行後、上記mysqldumpで `docs/schema.sql` を更新してもらう。
3. DAO・モデル・フロントの型を同時に更新する。

## 既知のデータ品質メモ

- `stickers.address`(varchar)は旧仕様の遺物。新規コードでは `address_id` を使う。
- 過去データの `addresses.state` に英語表記が混在している可能性がある。
  都道府県統計に欠けが出たら `UPDATE addresses SET state='東京都' WHERE state='Tokyo'` 等の移行SQLをユーザーに提案する。
