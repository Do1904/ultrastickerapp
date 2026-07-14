---
name: mobile-capacitor
description: mobile/ ディレクトリのCapacitorモバイルアプリ(iOS/Android)に関する作業ガイド。モバイルアプリのビルド・実機確認・ネイティブ機能追加・「アプリで動かない」系の不具合調査では必ず読むこと。カメラ/GPS/オフライン対応をネイティブプラグインで実装し直そうとする前にも読むこと(Web標準APIで実装済み)。
---

# モバイルアプリガイド (mobile/ = Capacitor)

## 設計方針(変更しないこと)

1. **モバイル専用コードは書かない。** mobile/ はCapacitorシェルのみで、
   アプリの実体は `myNewApp` のビルド成果物(`webDir: ../myNewApp/dist/my-new-app/browser`)。
   機能追加は常にmyNewApp側に行い、Webとアプリで100%コードを共有する。
2. **ネイティブプラグインより Web標準API を優先。** 実装済み:
   - カメラ撮影 → `<input type="file" capture="environment">`(sticker-form)
   - GPS現在地 → `navigator.geolocation`(location.service)
   - オフライン下書き → IndexedDB(draft.service。写真Blobごと保存)
   プッシュ通知など標準APIで不可能なものだけ `@capacitor/*` プラグインを検討する。
3. **APIの向き先切替は `myNewApp/src/app/const/api.ts`。**
   `window.Capacitor.isNativePlatform()` でネイティブ判定し `NATIVE_API_BASE`(LAN IP)を使う。

## 開発ワークフロー

```bash
cd mobile
npm install                # 初回のみ
npm run add:ios            # 初回のみ(ios/ 生成)
npm run add:android        # 初回のみ(android/ 生成)

npm run sync               # myNewAppをビルドしてネイティブに同期(コード変更のたび)
npm run open:ios           # Xcodeで開いてRun
npm run open:android       # Android StudioでRun
```

## 実機で動かすためのチェックリスト

1. `myNewApp/src/app/const/api.ts` の `NATIVE_API_BASE` を開発マシンのLAN IPに
   (`ipconfig getifaddr en0` で確認)。
2. `ultrasticker/.env` の `BASE_URL` も同じLAN IPに(写真URLがこの値でDB保存されるため。
   localhostのままだと実機で画像が404になる)。
3. 実機と開発マシンを同じWi-Fiに。バックエンド(`yarn dev`)起動。
4. 権限(初回のみ): iOSは Info.plist にカメラ/フォトライブラリ/位置情報の UsageDescription、
   Androidは AndroidManifest.xml に CAMERA / ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION。
   記載すべき正確なXMLは `mobile/README.md` にある。
5. HTTP(平文)通信は `capacitor.config.ts` の `server.cleartext: true` で許可済み(開発用)。
   **本番リリース時はAPIをHTTPS化して cleartext を外すこと。**

## トラブルシューティング

- 白画面 → `npm run sync` を忘れている / webDirのビルドが古い。
- API接続エラー → LAN IP設定(上記1,2)とWi-Fi、Macのファイアウォールを確認。
- 画像だけ出ない → `.env` の BASE_URL がlocalhostのまま。既存レコードのURLはDB内に
  絶対URLで保存されているため、`UPDATE stickers SET sticker = REPLACE(sticker, 'http://localhost:3000', 'http://<LAN IP>:3000')` の移行が必要な場合がある。
- カメラが起動しない → 権限のUsageDescription/uses-permission漏れ。
