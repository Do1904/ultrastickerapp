# Firebase Authentication セットアップ手順

このドキュメントの手順を上から順に実行すると、ログイン機能が動く状態になります。
所要時間はおよそ30〜40分です。

## 全体像

```
[ブラウザ / アプリ]                [Firebase]              [自前のExpressサーバー]
       |                              |                            |
       |-- メール・Googleでログイン -->|                            |
       |<-------- IDトークン ---------|                            |
       |                                                           |
       |-- Authorization: Bearer <IDトークン> -------------------->|
       |                                                           |-- 署名を検証
       |                                                           |-- firebase_uid で
       |                                                           |   usersテーブルを引く
       |<----------------- 自前DBのユーザーIDで処理した結果 --------|
```

パスワードは Firebase 側だけが保持します。自前のDBには一切保存しません。
`users.password` カラムは今後使いません(マイグレーションでNULLにします)。

---

## 1. Firebaseプロジェクトを作る

1. https://console.firebase.google.com/ を開く
2. 「プロジェクトを追加」→ プロジェクト名を入力(例: `fsm-japan`)
3. Google アナリティクスは不要なのでオフでよい
4. 作成完了まで待つ

## 2. 認証方法を有効にする

1. 左メニューの「構築」→「Authentication」→「始める」
2. 「Sign-in method」タブを開く
3. **メール/パスワード** を有効にする(「メールリンク」はオフのままでよい)
4. **Google** を有効にする
   - プロジェクトの公開名とサポートメールを設定するよう求められるので入力する

> Appleログインを追加する場合は Apple Developer Program(年 $99)への登録が必要です。
> iOSアプリでGoogleログインを提供する場合、App Store審査で
> 「Appleでサインイン」の併設を求められる点に注意してください。
> 後から追加できるので、まずはメールとGoogleで動かすのを勧めます。

## 3. Webアプリの設定値を取得する

1. 「プロジェクトの設定」(歯車アイコン)→「全般」タブ
2. 「マイアプリ」で **ウェブ(</>)** を選び、アプリを登録する
3. 表示される `firebaseConfig` の値を控える
4. `myNewApp/src/app/const/firebase.ts` の `PASTE_...` の部分を実際の値に置き換える

```ts
export const firebaseConfig = {
  apiKey: 'AIza...',                        // ← 実際の値に
  authDomain: 'fsm-japan.firebaseapp.com',
  projectId: 'fsm-japan',
  storageBucket: 'fsm-japan.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef',
};
```

> この値はブラウザに配信される公開情報なので、Gitにコミットして問題ありません。
> 実際のアクセス制御はFirebase側の設定とサーバーのトークン検証で行っています。

## 4. サーバー用の秘密鍵を取得する

1. 「プロジェクトの設定」→「サービス アカウント」タブ
2. 「新しい秘密鍵を生成」→ JSONファイルがダウンロードされる
3. `ultrasticker/.env` に以下を追記する(JSONの中の対応する値を転記)

```bash
FIREBASE_PROJECT_ID=fsm-japan
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fsm-japan.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
```

> ⚠️ **この秘密鍵は絶対にGitにコミットしないでください。**
> `ultrasticker/.gitignore` で `.env` は既に除外されています。
> ダウンロードしたJSONファイル自体もリポジトリ内に置かないでください。
> `FIREBASE_PRIVATE_KEY` は改行を `\n` の2文字のまま、ダブルクォートで囲みます。

## 5. データベースを更新する

```bash
cd /Users/ryotakondo/ultrastickerapp
mysql -u <ユーザー名> -p stickers < docs/migrations/001_add_firebase_uid.sql
```

`users` テーブルに `firebase_uid` カラムが追加されます。

## 6. パッケージをインストールする

```bash
# バックエンド
cd /Users/ryotakondo/ultrastickerapp/ultrasticker
npm install

# フロントエンド(このプロジェクトはyarnを使っています)
cd ../myNewApp
yarn install
```

## 7. 動作確認

```bash
# ターミナル1: バックエンド
cd /Users/ryotakondo/ultrastickerapp/ultrasticker
npm run dev
# → "✅ Firebase Admin initialized" が出れば成功

# ターミナル2: フロントエンド
cd /Users/ryotakondo/ultrastickerapp/myNewApp
yarn start
```

ブラウザで http://localhost:4200/login を開き、以下を確認します。

- [ ] アカウント作成 → ヘッダー右上にアバターが出る
- [ ] ログアウト → 「ログイン」リンクに戻る
- [ ] 再ログイン → 状態が復元される
- [ ] リロードしてもログイン状態が保持される
- [ ] ログアウト状態でステッカー詳細を開くと「ログインするとコメントできます」が出る
- [ ] ログイン状態でコメント投稿・削除ができる
- [ ] 他人のコメントに削除ボタンが出ない
- [ ] `/putSticker` に未ログインでアクセスするとログイン画面へ飛ぶ
- [ ] パスワード再設定メールが届く

---

## 8. モバイルアプリ対応(Android / iOS)

Webで動作確認できたら、ネイティブアプリ側の設定をします。

### Android

1. Firebaseコンソール →「プロジェクトの設定」→「マイアプリ」→ Androidアプリを追加
2. パッケージ名は `jp.fsmj.app`(`mobile/capacitor.config.ts` の `appId`)
3. `google-services.json` をダウンロードし、`mobile/android/app/` に置く
4. SHA-1 フィンガープリントを登録する(Googleログインに必須)

```bash
cd /Users/ryotakondo/ultrastickerapp/mobile/android
./gradlew signingReport
```

出力された `SHA1` の値をFirebaseコンソールのAndroidアプリ設定に追加します。

### iOS

1. Firebaseコンソールで iOS アプリを追加(Bundle IDは `jp.fsmj.app`)
2. `GoogleService-Info.plist` をダウンロードし、Xcodeで `App` ターゲットに追加
3. Xcodeが必要です(前に案内した Xcode + CocoaPods のセットアップを済ませてください)

### 同期

```bash
cd /Users/ryotakondo/ultrastickerapp/mobile
npm run sync
```

---

## 9. 本番公開前に必ずやること

現時点では開発用の設定になっています。公開前に以下を対応してください。

| 項目 | 現状 | 対応 |
|---|---|---|
| API通信の暗号化 | 平文HTTP(`cleartext: true`) | APIをHTTPS化し、`mobile/capacitor.config.ts` の `cleartext` を削除 |
| CORS | localhost系のみ許可 | `.env` の `ALLOWED_ORIGINS` に本番ドメインを追加 |
| APIキーの制限 | 制限なし | Google Cloud Console でWeb APIキーにHTTPリファラー制限をかける |
| メール確認 | 送信のみ(未確認でも利用可) | 必要なら `emailVerified` を必須にする |

`mobile/capacitor.config.ts` の `cleartext: true` を残したまま公開すると、
IDトークンが平文でネットワークを流れ、盗聴されるとアカウントを乗っ取られます。

---

## セキュリティ上の変更点(今回の実装で直したもの)

| 内容 | 変更前 | 変更後 |
|---|---|---|
| パスワードハッシュの漏洩 | `getUserByIds` が `password` をSELECTし、ステッカー詳細APIのレスポンスに含まれていた | 表示に必要なカラムのみ返す |
| メールアドレスの漏洩 | コメント投稿者のメールが全閲覧者に見えていた | 表示用プロフィールから除外 |
| コメント削除 | 誰でも任意のコメントを削除できた | 本人のみ(SQLのWHERE句で担保) |
| ステッカー削除・編集 | `userId` をリクエストボディで指定でき、なりすまし可能だった | トークンから判定 |
| CORS | `origin: '*'` で全許可 | 許可リスト方式 |
| レート制限 | なし | 書き込み系APIに 30回/分 |
| 全ユーザー一覧API | `GET /users/users` が全件返していた | 廃止し、必要なIDのみ問い合わせる形に変更 |

> ⚠️ `ultrasticker/.env.example` に実在しそうなDB認証情報が直接書かれていたため、
> プレースホルダーに置き換えました。
> **それが実際に使っているDBパスワードなら、変更することを強く推奨します。**
> 既にGitの履歴に含まれている場合は、履歴からの削除も検討してください。
