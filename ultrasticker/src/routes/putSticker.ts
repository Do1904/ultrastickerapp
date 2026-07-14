import express from "express";
import multer from "multer";
import path from "path";
import db from "../db/index.js";

const router = express.Router();

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  },
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
router.post("/putNewSticker", upload.single("sticker"), async (req, res) => {
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
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    res.status(400).json({
      error: "clubId, leagueId, countryId, latitude, longitude are required.",
    });
    return;
  }

  const userId = Number(b.userId) || 1; // TODO: 認証実装後にログインユーザーIDへ置換

  const filePath = `${BASE_URL}/uploads/${req.file.filename}`;

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

router.post("/editSticker", async (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: "Nothing editable." });
    return;
  }

  try {
    await db.stickers.updateStickerbyId(
      Number(req.body.clubId),
      Number(req.body.leagueId),
      Number(req.body.addressId),
      Number(req.body.countryId),
      req.body.isClean !== false,
      Number(req.body.id)
    );
    res.status(200).json({ message: "Sticker updated successfully" });
  } catch (error) {
    console.error("Error updating sticker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/deleteSticker", async (req, res) => {
  const stickerId = Number(req.body?.stickerId);
  const userId = Number(req.body?.userId) || 1;

  if (!stickerId) {
    res.status(400).json({ error: "stickerId is required." });
    return;
  }

  try {
    await db.stickers.deleteStickerbyId(stickerId, userId);
    res.status(200).json({ message: "Sticker deleted successfully" });
  } catch (error) {
    console.error("Error deleting sticker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
