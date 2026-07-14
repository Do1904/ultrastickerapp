---
name: verification-and-testing
description: このリポジトリでコードを変更した後の検証手順。コミット前・作業完了報告前には必ずこのスキルの手順で検証すること。TypeScriptコンパイル確認、Angularテンプレート型チェック、npmが使えない環境(サンドボックス)でのフォールバック、手動テストのチェックリストを含む。「ビルドが通るか確認して」と言われたときも必ず参照。
---

# 検証・テストガイド

## 検証の最低ライン(コード変更後は必ず実行)

### Backend (ultrasticker/)

```bash
cd ultrasticker
node node_modules/typescript/bin/tsc --noEmit    # 型チェック(エラーゼロを確認)
```

### Frontend (myNewApp/)

通常環境(npmが使える):
```bash
cd myNewApp
yarn build        # ng build。テンプレート型チェック(strictTemplates)込み
```

npmレジストリ/ネイティブバイナリが使えないサンドボックス環境では ng build が動かない
(esbuildのプラットフォームバイナリ不一致)。その場合のフォールバック:

```bash
cd myNewApp
# ngc = Angularコンパイラ。strictTemplatesでテンプレートも型チェックされる
node node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js -p tsconfig.app.json --noEmit
```

**⚠ ngc出力の罠**: エラー表示にANSIカラーコードが混ざるため、
`grep -c "error TS"` は「error」と「TS」の間にエスケープが入り**誤って0件になる**。
エラー有無は「出力が空かどうか」で判定するか、`--noEmit` なしで実行して終了コードを見る。

### 検証ツール自体の検証(負のテスト)

チェックが本当に機能しているか疑わしいときは、わざとエラーを注入して検出されることを確認する:
プロジェクトを /tmp にコピー(node_modulesはsymlink)し、テンプレートに存在しない
プロパティを書いて ngc がそれを報告するか見る。報告されたら本体はクリーンと確信できる。

## 自前実装ユーティリティの単体検証

`util/exif-gps.ts` 等の依存なしユーティリティは、tscで単体コンパイルしてNodeで直接テストできる:

```bash
node node_modules/typescript/bin/tsc exif-gps.ts --module commonjs --target es2020 --outDir /tmp/t
# Pythonで最小のGPS付きJPEGを合成 → node で extractGpsFromImage を呼び期待座標と比較
```

(実績あり: 渋谷座標のExifを合成しPASSを確認済み)

## 手動テストチェックリスト(UI変更時)

バックエンド+フロントを起動して http://localhost:4200 で:

1. 地図: 初期表示が日本全体 / マーカー表示 / クリックで詳細パネル / 地図クリックで新規投稿導線
2. フィルター: 国→リーグ→クラブのカスケードが連動し、ピンが絞り込まれる
3. 検索: 「渋谷」で地図が移動する
4. 右パネル: エリア(地図を動かすと更新)/ クラブ / 都道府県 タブ
5. レイヤー: マーカー ↔ ヒートマップ ↔ 勢力図 の切替で前のレイヤーが残らないこと
6. 投稿: 写真選択(Exif GPSで位置自動設定)→ クラブ選択 → 投稿 → 地図に反映
7. 下書き: オフライン(DevToolsでOffline)にして下書き保存 → 復帰 → 読み込み → 投稿

## 環境に関する注意(Claudeサンドボックス)

- npmレジストリ(registry.npmjs.org)が403でブロックされる環境がある。
  その場合パッケージ追加は package.json に記載だけしてユーザーにinstallしてもらうか、
  依存なしで自前実装する(このプロジェクトの方針は後者寄り)。
- ローカルMySQLへ直接接続できない。SQL実行・スキーマ確認はユーザーに依頼する
  (`database-schema` スキル参照)。
- `git` の一部操作(index.lockの削除等)が制限されることがある。コミットはユーザーに任せる。
