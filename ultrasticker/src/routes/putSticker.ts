import express from "express";
import multer from "multer";
import path from "path";
import db from "../db/index.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/putNewSticker", upload.single("sticker"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  const filePath = `http://localhost:3000/${req.file.path.replace(
    "public/",
    ""
  )}`;

  const reqBody = req.body;

  // TODO: 必須フィールドのチェック  バリデーションライブラリを使う
  if (
    !reqBody.country ||
    !reqBody.state ||
    !reqBody.city ||
    !reqBody.district ||
    !reqBody.neighbourhood ||
    !reqBody.postcode ||
    !reqBody.clubId ||
    !reqBody.leagueId ||
    !reqBody.countryId ||
    !reqBody.longitude ||
    !reqBody.latitude
  ) {
    res.status(400).send("Missing required fields.");
    return;
  }

  const userId = 1; // 仮のユーザーID
  try {
    let currentMaxAddressId;
    currentMaxAddressId = await db.addresses.checkAddressExist(
      reqBody.country,
      reqBody.state,
      reqBody.city,
      reqBody.district,
      reqBody.neighbourhood,
      reqBody.postcode
    );

    if (!currentMaxAddressId) {
      currentMaxAddressId = await db.systemParams.getSystemParamByKey(
        "latestAddressId"
      );
      await db.systemParams.setSystemParam(
        "latestAddressId",
        Number(currentMaxAddressId) + 1
      );
    }

    await db.addresses.putNewAddress(
      currentMaxAddressId + 1,
      reqBody.country,
      reqBody.state,
      reqBody.city,
      reqBody.district,
      reqBody.neighbourhood,
      reqBody.postcode
    );
    await db.stickers.putNewSticker(
      userId,
      filePath,
      Number(reqBody.clubId),
      Number(reqBody.leagueId),
      currentMaxAddressId + 1,
      Number(reqBody.countryId),
      reqBody.longitude,
      reqBody.latitude
    );
    res.status(200).send("Sticker uploaded successfully");
  } catch (error) {
    console.error("Error uploading sticker:", error);
    res.status(500).send("Internal server error");
  }
});

router.post("editSticker", async (req, res) => {
  if (!req.body) {
    res.status(400).send("Nothing editable.");
    return;
  }

  try {
    await db.stickers.updateStickerbyId(
      req.body.clubId,
      req.body.leagueId,
      req.body.address,
      req.body.countyId,
      req.body.is_clean,
      req.body.id
    );
    res.status(200).send("Sticker edited successfully");
  } catch (error) {
    console.error("Error editing sticker:", error);
    res.status(500).send("Internal server error");
  }
});

router.post("/deleteSticker", async (req, res) => {
  const reqBody = req.body;
  const userId = 1; // 仮のユーザーID

  if (!reqBody) {
    res.status(400).send("Nothing editable.");
    return;
  }

  try {
    await db.stickers.deleteStickerbyId(reqBody.stickerId, userId);
    res.status(200).send("Sticker deleted successfully");
  } catch (error) {
    console.error("Error deleting sticker:", error);
    res.status(500).send("Internal server error");
  }
});

export default router;
