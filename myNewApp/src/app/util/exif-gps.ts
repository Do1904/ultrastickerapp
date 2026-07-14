/**
 * JPEG画像のExifからGPS座標を抽出する軽量パーサー(依存パッケージなし)。
 * GPS情報が存在しない・JPEG以外の場合は null を返す。
 */
export async function extractGpsFromImage(
  file: File
): Promise<{ lat: number; lng: number } | null> {
  try {
    const buffer = await file.arrayBuffer();
    return parseJpegGps(new DataView(buffer));
  } catch {
    return null;
  }
}

function parseJpegGps(dv: DataView): { lat: number; lng: number } | null {
  // JPEG SOI マーカー確認
  if (dv.byteLength < 4 || dv.getUint16(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 4 <= dv.byteLength) {
    const marker = dv.getUint16(offset);
    if ((marker & 0xff00) !== 0xff00) break;

    const size = dv.getUint16(offset + 2);

    // APP1 (Exif) セグメント
    if (
      marker === 0xffe1 &&
      offset + 10 <= dv.byteLength &&
      dv.getUint32(offset + 4) === 0x45786966 // "Exif"
    ) {
      return parseTiff(dv, offset + 10);
    }

    offset += 2 + size;
  }
  return null;
}

function parseTiff(dv: DataView, tiffStart: number): { lat: number; lng: number } | null {
  if (tiffStart + 8 > dv.byteLength) return null;

  const byteOrder = dv.getUint16(tiffStart);
  const little = byteOrder === 0x4949; // "II" = リトルエンディアン
  if (!little && byteOrder !== 0x4d4d) return null;

  const get16 = (o: number) => dv.getUint16(o, little);
  const get32 = (o: number) => dv.getUint32(o, little);

  const ifd0Offset = get32(tiffStart + 4);

  // IFD0からGPS IFDポインタ (tag 0x8825) を探す
  const gpsIfdOffset = findTagValue(dv, tiffStart, tiffStart + ifd0Offset, 0x8825, little);
  if (gpsIfdOffset === null) return null;

  const gpsIfd = tiffStart + gpsIfdOffset;
  if (gpsIfd + 2 > dv.byteLength) return null;

  let latRef: string | null = null;
  let lngRef: string | null = null;
  let lat: number | null = null;
  let lng: number | null = null;

  const count = get16(gpsIfd);
  for (let i = 0; i < count; i++) {
    const entry = gpsIfd + 2 + i * 12;
    if (entry + 12 > dv.byteLength) break;

    const tag = get16(entry);

    if (tag === 1 || tag === 3) {
      // GPSLatitudeRef / GPSLongitudeRef (ASCII, インライン格納)
      const ch = String.fromCharCode(dv.getUint8(entry + 8));
      if (tag === 1) latRef = ch;
      else lngRef = ch;
    } else if (tag === 2 || tag === 4) {
      // GPSLatitude / GPSLongitude (RATIONAL × 3)
      const valueOffset = tiffStart + get32(entry + 8);
      const dms = readRationals(dv, valueOffset, 3, little);
      if (!dms) continue;
      const decimal = dms[0] + dms[1] / 60 + dms[2] / 3600;
      if (tag === 2) lat = decimal;
      else lng = decimal;
    }
  }

  if (lat === null || lng === null) return null;

  if (latRef === 'S') lat = -lat;
  if (lngRef === 'W') lng = -lng;

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

function findTagValue(
  dv: DataView,
  tiffStart: number,
  ifdStart: number,
  targetTag: number,
  little: boolean
): number | null {
  if (ifdStart + 2 > dv.byteLength) return null;

  const count = dv.getUint16(ifdStart, little);
  for (let i = 0; i < count; i++) {
    const entry = ifdStart + 2 + i * 12;
    if (entry + 12 > dv.byteLength) break;
    if (dv.getUint16(entry, little) === targetTag) {
      return dv.getUint32(entry + 8, little);
    }
  }
  return null;
}

function readRationals(
  dv: DataView,
  offset: number,
  count: number,
  little: boolean
): number[] | null {
  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    const o = offset + i * 8;
    if (o + 8 > dv.byteLength) return null;
    const numerator = dv.getUint32(o, little);
    const denominator = dv.getUint32(o + 4, little);
    if (denominator === 0) return null;
    values.push(numerator / denominator);
  }
  return values;
}
