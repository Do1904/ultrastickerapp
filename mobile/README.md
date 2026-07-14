# FSM Japan — モバイルアプリ (Capacitor)

`myNewApp`(Angular)のビルド成果物をそのままiOS/Androidアプリとして動かすCapacitorシェルです。
Webとコードを100%共有し、カメラ撮影・GPS現在地・オフライン下書きはWeb標準API(`<input capture>` / Geolocation / IndexedDB)で実装済みのため、追加のネイティブプラグインは不要です。

## 前提

- Node.js / yarn
- iOS: macOS + Xcode(+ CocoaPods `sudo gem install cocoapods`)
- Android: Android Studio

## 初回セットアップ

```bash
cd mobile
npm install

# ネイティブプロジェクト生成(初回のみ)
npm run add:ios
npm run add:android
```

### 1. APIの向き先を設定(重要)

実機・エミュレータからは `localhost` が使えないため、開発マシンのLAN IPを設定します。

```bash
ipconfig getifaddr en0   # MacのLAN IPを確認
```

- `myNewApp/src/app/const/api.ts` の `NATIVE_API_BASE` をそのIPに変更
- `ultrasticker/.env` の `BASE_URL` も同じIPに変更(写真URLがこの値で保存されるため)
- iPhone/Androidと開発マシンを同じWi-Fiに接続しておく

### 2. 権限設定

**iOS**: `ios/App/App/Info.plist` に以下を追加

```xml
<key>NSCameraUsageDescription</key>
<string>ステッカーの写真を撮影するために使用します</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>ステッカーの写真を選択するために使用します</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>発見場所を記録し、現在地周辺の地図を表示するために使用します</string>
```

**Android**: `android/app/src/main/AndroidManifest.xml` の `<manifest>` 直下に追加

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## ビルド・実行

```bash
# バックエンドを起動しておく(別ターミナル)
cd ../ultrasticker && yarn dev

# Webをビルドしてネイティブへ同期 → IDEで実行
cd ../mobile
npm run sync
npm run open:ios       # Xcodeが開く → 実機/シミュレータで Run
npm run open:android   # Android Studioが開く → Run
```

コード変更時は `npm run sync` を再実行してからIDEでビルドし直します。

## 構成メモ

- `webDir` は `../myNewApp/dist/my-new-app/browser` を参照(myNewAppのビルド成果物)
- `server.cleartext: true` は開発用(HTTP API向け)。本番はAPIをHTTPS化して無効にする
- モバイル向け機能はすべて `myNewApp` 側に実装済み:
  - カメラ起動撮影: 投稿フォームの「📷 カメラで撮影」(`capture="environment"`)
  - GPS現在地: 地図の現在地ボタン / 投稿フォームの「現在地を使う」
  - オフライン下書き: 電波なしでも撮影→下書き保存(IndexedDB)→復帰後に投稿
- 将来ネイティブ機能(プッシュ通知など)が必要になったら `@capacitor/*` プラグインを追加する
