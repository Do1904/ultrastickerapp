import express from "express";
import multer from "multer";
import db from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";
import { saveStickerImage, InvalidImageError } from "../util/imageUpload.js";

const router = express.Router();

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

/**
 * いったんメモリで受け取り、saveStickerImage() で検証・再エンコードしてから書き出す。
 * ディスクへ直接保存すると、検証前の生ファイルが一瞬でも公開ディレクトリに置かれてしまう。
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 1 }, // 20MB
});

/**
 * ステッカー新規投稿。
 * multipart/form-data:
 *  - sticker: 画像ファイル(必須)
 *  - clubId, leagueId, countryId: 必須
 *  - latitude, longitude: 必須
 *  - country, state, city, district, neighbourhood, postcode: 住所(任意)
 *  - comment: 投稿コメント(任意) → comments テーブルに first_flag=1 で保存
 */
router.post("/putNewSticker", requireAuth, upload.single("sticker"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  const b = req.body;

  const clubId = Number(b.clubId);
  const leagueId = Number(b.leagueId);
  const countryId = Number(b.countryId);
  const latitude = Number(b.latitude);
  const longitude = Number(b.longitude);

  if (
    !clubId ||
    !leagueId ||
    !countryId ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    res.status(400).json({
      error: "clubId, leagueId, countryId, latitude, longitude are required.",
    });
    return;
  }

  // 座標として成立しない値を弾く(Infinityや範囲外の値がDBに入るのを防ぐ)
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    res.status(400).json({ error: "latitude/longitude の値が範囲外です。" });
    return;
  }

  // 投稿者はトークンから決める。クライアントから送られてくるuserIdは信用しない。
  const userId = req.user!.id;

  // 画像の検証・再エンコード(EXIF除去)を先に済ませる。
  // ここで弾かれたリクエストはDBに一切触れない。
  let filename: string;
  try {
    filename = await saveStickerImage(req.file.buffer);
  } catch (error) {
    if (error instanceof InvalidImageError) {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  const filePath = `${BASE_URL}/uploads/${filename}`;

  try {
    const addressId = await db.addresses.findOrCreateAddress({
      country: b.country ?? "",
      state: b.state ?? "",
      city: b.city ?? "",
      district: b.district ?? "",
      neighbourhood: b.neighbourhood ?? "",
      postcode: b.postcode ?? "",
    });

    const stickerId = await db.stickers.putNewSticker(
      userId,
      filePath,
      clubId,
      leagueId,
      addressId,
      countryId,
      longitude,
      latitude
    );

    // 投稿コメント(任意)は comments テーブルに first_flag=1 で保存
    if (b.comment && String(b.comment).trim().length > 0) {
      await db.comments.postComment(
        String(b.comment).trim(),
        userId,
        stickerId,
        true,
        null
      );
    }

    res.status(200).json({ id: stickerId, message: "Sticker uploaded successfully" });
  } catch (error) {
    console.error("Error uploading sticker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/editSticker", requireAuth, async (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: "Nothing editable." });
    return;
  }

  try {
    const updated = await db.stickers.updateStickerbyId(
      Number(req.body.clubId),
      Number(req.body.leagueId),
      Number(req.body.addressId),
      Number(req.body.countryId),
      req.body.isClean !== false,
      Number(req.body.id),
      req.user!.id
    );

    if (updated === 0) {
      res.status(403).json({ error: "自分の投稿のみ編集できます" });
      return;
    }

    res.status(200).json({ message: "Sticker updated successfully" });
  } catch (error) {
    console.error("Error updating sticker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/deleteSticker", requireAuth, async (req, res) => {
  const stickerId = Number(req.body?.stickerId);
  // 削除者はトークンから決める。body経由のuserIdは受け付けない。
  const userId = req.user!.id;

  if (!stickerId) {
    res.status(400).json({ error: "stickerId is required." });
    return;
  }

  try {
    const deleted = await db.stickers.deleteStickerbyId(stickerId, userId);

    if (deleted === 0) {
      res.status(403).json({ error: "自分の投稿のみ削除できます" });
      return;
    }

    res.status(200).json({ message: "Sticker deleted successfully" });
  } catch (error) {
    console.error("Error deleting sticker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
