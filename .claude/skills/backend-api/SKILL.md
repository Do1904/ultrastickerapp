---
name: backend-api
description: ultrasticker (Express + mysql2) バックエンドのAPI追加・変更・修正の作法。エンドポイント新設、DAO作成、SQL記述、位置情報(座標)の扱い、multerでの画像アップロード、バリデーションに関わる作業では必ずこのスキルを読むこと。特に座標のPOINT型やST_X/ST_Yを触るなら読まずに書いてはいけない(緯度経度の取り違え事故が起きやすい)。
---

# Backend API 開発ガイド (ultrasticker/)

## レイヤー構造

```
server.ts                 # ルーターのマウント。新ルーターはここに追加
src/routes/<domain>.ts    # HTTPハンドラ。リクエスト検証・整形・エラー応答のみ
src/dao/<domain>.ts       # SQLはここに集約。routesに生SQLを書かない
src/db/queryUtils.ts      # selectQuery<T> / executeQuery / countQuery (これ以外でpoolを直接触らない)
src/db/connection.ts      # mysql2プール。接続情報は .env (dotenv)
src/db/index.ts           # dao の集約エクスポート。routes からは `db.stickers.xxx()` で呼ぶ
src/models/*.ts           # レスポンス型
```

ESMプロジェクト。**import文の相対パスは必ず `.js` 拡張子付き**(TSファイルでも)。
例: `import db from '../db/index.js';`

## エンドポイント追加の手順

1. `src/dao/` に関数追加(または新ファイル)。SQLは列エイリアスでcamelCaseに変換して返す
   (例: `stickers.club_id as clubId`)。
2. `src/routes/` にハンドラ追加。パターン:
   ```ts
   router.get('/xxx', async (req, res) => {
     const id = Number(req.query['id']);          // 必ずNumber()で変換しNaN検証
     if (Number.isNaN(id)) { res.status(400).json({ error: '...' }); return; }
     try {
       res.json(await db.xxx.yyy(id));
     } catch (error) {
       console.error('Error ...:', error);
       res.status(500).json({ error: 'Internal server error' });
     }
   });
   ```
3. 新ルーターなら `server.ts` にマウント追加。
4. 検証: `node node_modules/typescript/bin/tsc --noEmit`(詳細は `verification-and-testing`)。

## ⚠ 座標(空間データ)の絶対規則

- `stickers.coordinate` は `POINT` 型(SRID 0)。**`POINT(経度 緯度)` = lng first** で保存されている。
- 読み出し: `ST_X(coordinate)` = **longitude**、`ST_Y(coordinate)` = **latitude**。
- 挿入: `ST_GeomFromText(?)` に `` `POINT(${longitude} ${latitude})` `` を渡す。
- 範囲検索は `ST_Y BETWEEN minLat AND maxLat AND ST_X BETWEEN minLng AND maxLng` で十分
  (データ量が小さく空間インデックスも未設定のため)。
- メッシュ集計は `FLOOR(ST_Y(coordinate) / cellSize)` パターン(`dao/stats.ts` 参照)。

## 住所の登録(採番の罠)

`addresses` には (country,state,city,district,neighbourhood,postcode) の複合UNIQUEがある。
新規住所は必ず `db.addresses.findOrCreateAddress()` を使う:

```sql
INSERT INTO addresses (...) VALUES (...)
ON DUPLICATE KEY UPDATE address_id = LAST_INSERT_ID(address_id)
```

これで既存なら既存ID、新規なら新IDが `result.insertId` で返る。
**`system_params` の latestAddressId による手動採番は廃止済み。復活させないこと。**
NULLはUNIQUE制約をすり抜けるため、住所フィールドは NULL ではなく空文字 `''` で保存する。

## 画像アップロード (routes/putSticker.ts)

- multer で `public/uploads/` に保存。ファイル名は `Date.now() + 拡張子`。
- DBに保存するURLは `${process.env.BASE_URL}/uploads/<filename>`。
  実機モバイル検証時は `.env` の `BASE_URL` をLAN IPにしないと画像が表示されない。
- `fileFilter` で `image/*` のみ許可、上限20MB。
- 投稿コメントは同リクエストの `comment` フィールドで受け、
  `db.comments.postComment(comment, userId, stickerId, true, null)`(first_flag=1)で保存。

## その他の規約

- CORSは全許可(`origin: '*'`)。開発用の設定であり本番前に絞る。
- 認証未実装につき `const userId = Number(b.userId) || 1;` パターン。TODOコメントを残す。
- 統計系は `/stats` 配下(`routes/stats.ts`)。集計の重い整形(セルごとの支配クラブ算出など)は
  SQLでGROUP BYした行をNode側でMap集計する2段構え。既存実装のパターンを踏襲する。
- クラブ名・リーグ名はバックエンドでは解決**できない**(マスタがフロントにしかない)。
  APIはIDのみ返し、名前解決はフロントの `clubMaps` に任せる。
