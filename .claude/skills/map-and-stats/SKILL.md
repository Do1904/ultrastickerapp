---
name: map-and-stats
description: 地図(Leaflet)・統計・ランキング・ヒートマップ・勢力図まわりの実装知識。MapComponentの変更、レイヤー追加、新しい統計/集計/ランキング機能の追加、GeoJSONや都道府県データを扱う作業では必ず読むこと。「新しい統計を1つ足す」ためのエンドツーエンドのレシピを含む。
---

# 地図・統計機能ガイド

## MapComponent の構造 (components/map/)

トップページ(`/`)。1コンポーネントに集約されており、主な状態は:

- **レイヤーモード** `layerMode: 'markers' | 'heat' | 'territory'` — 排他切替。
  `setLayerMode()` が全レイヤーを外してから選択レイヤーを構築する。
  レイヤーを追加する場合もこの排他管理に乗せる(消し忘れが最頻出バグ)。
- **都道府県勢力図** `showPrefectures` — 上記と独立したオーバーレイ(GeoJSON)。
- **フィルター** 国/リーグ/クラブ(カスケード)。`applyFilters()` がピン再取得+ヒート再描画。
- **詳細パネル** marker-detail-panel(下中央)。地図クリック=新規投稿導線(id=-1のPin)。
- **エリアランキング** moveend → `scheduleRankingUpdate()`(400ms debounce)→ `/stats/ranking?bbox`。

タイル: OpenStreetMap HOT。初期表示は日本全体 `[36.5, 137.0] zoom 5`。

## マーカー

クラブカラーの旗SVG: `createColoredFlagSvg(color1, color2)` (const/flag.ts) を
data URLにしてL.icon化。マーカーは `L.layerGroup()` にまとめて一括add/remove。

## ヒートマップ

`util/heat-layer.ts` の `createHeatLayer(L, latlngs, opts)`(自前Canvas実装)。
leaflet.heatを入れ直さないこと(npm依存を増やさない方針)。
クラブフィルター選択時はそのクラブのみの密度になる(`/stats/heatmap?clubId=`)。

## 勢力図(このアプリの目玉機能)

- **メッシュ版**: `/stats/territory?cell=0.05`(約5km格子)。セルごとの支配クラブを
  `L.rectangle` + クラブカラー(fillOpacity 0.45)+ tooltipで描画。
- **都道府県版**: `assets/geos/japan.geojson` を `/stats/prefectures` の結果で色分け。
  **GeoJSONの都道府県名プロパティは `feature.properties.nam_ja`**(日本語名)。
  `name` ではないので注意。`addresses.state` と文字列一致で結合する。
- 市区町村版のAPI(`/stats/territory/cities`)は実装済みだがUI未接続。市区町村の
  境界ポリゴンが無いため、使う場合は代表座標にラベル/円を置く方式にする。

## 新しい統計機能を追加するレシピ(エンドツーエンド)

例:「月別投稿数」を追加する場合。

1. **DAO** `ultrasticker/src/dao/stats.ts` に集計クエリ追加:
   `SELECT DATE_FORMAT(created_at,'%Y-%m') as month, COUNT(*) as count FROM stickers GROUP BY month`
2. **Route** `ultrasticker/src/routes/stats.ts` にエンドポイント追加(既存のtry/catchパターン)。
3. **Service** `myNewApp/src/app/service/stats.service.ts` にインターフェース+メソッド追加。
4. **UI** map.component の右パネル: `rightTab` に選択肢を追加し、テンプレートに
   `*ngIf="rightTab === 'xxx'"` セクションを追加。`loadStats()` でまとめて取得。
5. クラブIDを表示する場合は `clubName(id)` / `clubColor(id)` ヘルパーを使う(IDのまま出さない)。
6. `verification-and-testing` の手順で検証。

## 座標・集計の落とし穴

- SQL側: ST_X=経度, ST_Y=緯度(`backend-api` スキル参照)。bboxパラメータは
  minLat/minLng/maxLat/maxLng の4つで統一している。
- COUNT(*)はmysql2からstringで返ることがあるため、Node側集計では `Number(row.count)` を通す。
- 都道府県統計は `addresses.state` が空/英語の行を拾えない。欠けが出たらデータ移行を提案
  (`database-schema` スキル参照)。
