import sharp from "sharp";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * アップロード画像の安全な保存処理。
 *
 * 以前の実装には次の問題があった:
 *  1. 保存名の拡張子を `path.extname(file.originalname)` から取っていた。
 *     拡張子はユーザーが決められるため、`evil.html` を送れば `.html` で保存され、
 *     express.static が text/html として配信してしまう(保存型XSS)。
 *  2. 種別判定が `file.mimetype` 頼りだった。MIMEタイプはクライアントの自己申告なので
 *     偽装でき、検査の意味をなさない。
 *  3. SVGは `image/svg+xml` として正当に検査を通るが、中に <script> を書ける。
 *  4. 元ファイルをそのまま保存するため、EXIF(GPS座標・撮影日時・機種・シリアル番号)が
 *     公開画像に残っていた。
 *
 * 対策として、受け取ったバイト列を sharp で必ず再エンコードする。
 *  - sharp がデコードできない入力は画像ではないので弾かれる(偽装・SVG対策)
 *  - 出力形式と拡張子はサーバーが決める(拡張子注入対策)
 *  - 再エンコードの結果、EXIFは引き継がれない(位置情報の漏洩対策)
 *  - ファイル名はUUIDで生成する(推測・衝突の防止)
 */

/** 保存先(server.ts の express.static が配信するディレクトリ) */
const UPLOAD_DIR = "public/uploads";

/** 長辺の上限。これを超える画像は縮小する(ストレージと転送量の節約) */
const MAX_DIMENSION = 2000;

/** デコードを試みる前にはじく上限。multer 側でも制限しているが二重で持つ。 */
const MAX_BYTES = 20 * 1024 * 1024;

export class InvalidImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidImageError";
  }
}

/**
 * 画像バイト列を検証・再エンコードして保存し、公開用のファイル名を返す。
 * @throws InvalidImageError 画像として解釈できない場合
 */
export async function saveStickerImage(buffer: Buffer): Promise<string> {
  if (!buffer || buffer.length === 0) {
    throw new InvalidImageError("ファイルが空です");
  }
  if (buffer.length > MAX_BYTES) {
    throw new InvalidImageError("ファイルサイズが大きすぎます");
  }

  let pipeline: sharp.Sharp;
  let metadata: sharp.Metadata;

  try {
    pipeline = sharp(buffer, {
      // 壊れた画像や細工された入力を早めに弾く
      failOn: "truncated",
      // 圧縮爆弾(小さなファイルが巨大な画素数に展開される)への上限。
      // 8000x8000 相当を超える入力は受け付けない。
      limitInputPixels: 64_000_000,
    });
    metadata = await pipeline.metadata();
  } catch {
    throw new InvalidImageError("画像として読み取れないファイルです");
  }

  // SVGはスクリプトを埋め込めるため、ラスタ画像のみ受け付ける
  if (metadata.format === "svg") {
    throw new InvalidImageError(
      "SVG形式には対応していません。JPEG・PNG・WebPなどの写真形式でアップロードしてください。"
    );
  }
  if (!metadata.format) {
    throw new InvalidImageError("対応していない画像形式です");
  }
  if (!metadata.width || !metadata.height) {
    throw new InvalidImageError("画像の寸法を取得できませんでした");
  }

  // JPEGへ再エンコードする。この工程でEXIFを含むメタデータは引き継がれない。
  // (sharpは明示的に .withMetadata() を呼ばない限りメタデータを出力しない)
  const output = await pipeline
    .rotate() // EXIFのOrientationを画素に焼き込んでから破棄する
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  const filename = `${randomUUID()}.jpg`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  // path.join でディレクトリを固定し、ファイル名もUUIDなのでパストラバーサルは起きない
  await writeFile(path.join(UPLOAD_DIR, filename), output);

  return filename;
}
