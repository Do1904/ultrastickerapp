import express from "express";
import * as stats from "../dao/stats.js";

const router = express.Router();

/**
 * グループごとに合計数と「支配クラブ(最多投稿クラブ)」を集計する共通ヘルパー。
 * territory(メッシュ)と territory/cities(市区町村)で同じロジックを共有する。
 * topRow には支配クラブの元行を保持し、呼び出し側が追加情報(座標等)を取り出せる。
 */
interface DominantEntry<T> {
  total: number;
  topClubId: number;
  topCount: number;
  topRow: T;
}

function aggregateDominant<T>(
  rows: T[],
  keyOf: (row: T) => string,
  clubIdOf: (row: T) => number,
  countOf: (row: T) => number
): Map<string, DominantEntry<T>> {
  const byKey = new Map<string, DominantEntry<T>>();

  for (const row of rows) {
    const key = keyOf(row);
    const count = countOf(row);

    let entry = byKey.get(key);
    if (!entry) {
      entry = { total: 0, topClubId: clubIdOf(row), topCount: 0, topRow: row };
      byKey.set(key, entry);
    }
    entry.total += count;
    if (count > entry.topCount) {
      entry.topCount = count;
      entry.topClubId = clubIdOf(row);
      entry.topRow = row;
    }
  }

  return byKey;
}

/** ルートハンドラ共通のtry/catchラッパー */
function handle(fn: (req: express.Request, res: express.Response) => Promise<void>) {
  return async (req: express.Request, res: express.Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error(`Error in ${req.baseUrl}${req.path}:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

/** クラブ別統計(投稿数・最新投稿) */
router.get("/clubs", handle(async (req, res) => {
  res.json(await stats.getClubStats());
}));

/** 地図範囲内ランキング: /stats/ranking?minLat=..&minLng=..&maxLat=..&maxLng=.. */
router.get("/ranking", handle(async (req, res) => {
  const minLat = Number(req.query["minLat"]);
  const minLng = Number(req.query["minLng"]);
  const maxLat = Number(req.query["maxLat"]);
  const maxLng = Number(req.query["maxLng"]);

  if ([minLat, minLng, maxLat, maxLng].some((v) => Number.isNaN(v))) {
    res.status(400).json({ error: "minLat, minLng, maxLat, maxLng are required." });
    return;
  }

  res.json(await stats.getRankingInBounds(minLat, minLng, maxLat, maxLng));
}));

/** 都道府県ごとのクラブ別投稿数(クラブ内訳の全リスト付き) */
router.get("/prefectures", handle(async (req, res) => {
  const rows = await stats.getPrefectureClubCounts();

  const byState = new Map<
    string,
    { state: string; total: number; clubs: { clubId: number; count: number }[] }
  >();

  for (const row of rows) {
    let entry = byState.get(row.state);
    if (!entry) {
      entry = { state: row.state, total: 0, clubs: [] };
      byState.set(row.state, entry);
    }
    entry.total += Number(row.count);
    entry.clubs.push({ clubId: row.clubId, count: Number(row.count) });
  }

  const result = [...byState.values()]
    .map((entry) => ({
      ...entry,
      clubs: entry.clubs.sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.total - a.total);

  res.json(result);
}));

/** ヒートマップ用座標一覧: /stats/heatmap?clubId=1001001 (clubId省略で全件) */
router.get("/heatmap", handle(async (req, res) => {
  const clubId = req.query["clubId"] ? Number(req.query["clubId"]) : undefined;

  const points = await stats.getHeatPoints(clubId);
  const prefectures = clubId ? await stats.getPrefectureDensityByClub(clubId) : [];
  res.json({ points, prefectures });
}));

/**
 * 勢力図: メッシュ単位で最も投稿数の多いクラブを返す。
 * /stats/territory?cell=0.05
 */
router.get("/territory", handle(async (req, res) => {
  const cellSize = req.query["cell"] ? Number(req.query["cell"]) : 0.05;

  if (Number.isNaN(cellSize) || cellSize <= 0 || cellSize > 5) {
    res.status(400).json({ error: "cell must be a number between 0 and 5." });
    return;
  }

  const rows = await stats.getTerritoryCells(cellSize);
  const byCell = aggregateDominant(
    rows,
    (row) => `${row.latCell}:${row.lngCell}`,
    (row) => row.clubId,
    (row) => Number(row.count)
  );

  const cells = [...byCell.values()].map((entry) => ({
    minLat: Number(entry.topRow.latCell) * cellSize,
    maxLat: (Number(entry.topRow.latCell) + 1) * cellSize,
    minLng: Number(entry.topRow.lngCell) * cellSize,
    maxLng: (Number(entry.topRow.lngCell) + 1) * cellSize,
    clubId: entry.topClubId,
    count: entry.topCount,
    total: entry.total,
  }));

  res.json({ cellSize, cells });
}));

/** 勢力図(市区町村単位): 市区町村ごとの支配クラブ */
router.get("/territory/cities", handle(async (req, res) => {
  const rows = await stats.getCityClubCounts();
  const byCity = aggregateDominant(
    rows,
    (row) => `${row.state}:${row.city}`,
    (row) => row.clubId,
    (row) => Number(row.count)
  );

  const result = [...byCity.values()]
    .map((entry) => ({
      city: entry.topRow.city,
      state: entry.topRow.state,
      total: entry.total,
      topClubId: entry.topClubId,
      topCount: entry.topCount,
      latitude: Number(entry.topRow.latitude),
      longitude: Number(entry.topRow.longitude),
    }))
    .sort((a, b) => b.total - a.total);

  res.json(result);
}));

export default router;
