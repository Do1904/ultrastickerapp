/**
 * Canvasベースの軽量ヒートマップレイヤー(leaflet.heat相当・依存パッケージなし)。
 * 使用例:
 *   const layer = createHeatLayer(L, [[35.68, 139.76], ...], { radius: 30 });
 *   layer.addTo(map);
 */
export interface HeatLayerOptions {
  radius?: number;
  blur?: number;
  minOpacity?: number;
  maxIntensity?: number;
}

export function createHeatLayer(
  L: any,
  latlngs: [number, number][],
  options: HeatLayerOptions = {}
): any {
  const radius = options.radius ?? 28;
  const blur = options.blur ?? 18;
  const minOpacity = options.minOpacity ?? 0.05;
  const maxIntensity = options.maxIntensity ?? 5;

  const HeatLayer = L.Layer.extend({
    onAdd(map: any) {
      this._map = map;
      this._canvas = document.createElement('canvas');
      this._canvas.style.position = 'absolute';
      this._canvas.style.pointerEvents = 'none';
      map.getPanes().overlayPane.appendChild(this._canvas);

      map.on('moveend zoomend resize', this._reset, this);
      this._reset();
      return this;
    },

    onRemove(map: any) {
      map.getPanes().overlayPane.removeChild(this._canvas);
      map.off('moveend zoomend resize', this._reset, this);
      return this;
    },

    _reset() {
      const map = this._map;
      const size = map.getSize();
      const topLeft = map.containerPointToLayerPoint([0, 0]);

      L.DomUtil.setPosition(this._canvas, topLeft);
      this._canvas.width = size.x;
      this._canvas.height = size.y;

      this._redraw();
    },

    _redraw() {
      const map = this._map;
      const canvas: HTMLCanvasElement = this._canvas;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. グレースケールで点を重ね描き(アルファ値が密度を表す)
      const pointAlpha = Math.min(1, 1 / Math.max(1, maxIntensity));
      const circle = createGradientCircle(radius, blur);
      const r = radius + blur;

      const bounds = map.getBounds().pad(0.2);
      for (const [lat, lng] of latlngs) {
        if (!bounds.contains([lat, lng])) continue;
        const point = map.latLngToContainerPoint([lat, lng]);
        ctx.globalAlpha = Math.max(pointAlpha, 0.25);
        ctx.drawImage(circle, point.x - r, point.y - r);
      }

      // 2. アルファ値をカラーパレットへ変換
      colorize(ctx, canvas.width, canvas.height, minOpacity);
    },
  });

  const layer = new HeatLayer();
  layer.setLatLngs = (newLatLngs: [number, number][]) => {
    latlngs = newLatLngs;
    if (layer._map) layer._redraw();
  };
  return layer;
}

function createGradientCircle(radius: number, blur: number): HTMLCanvasElement {
  const circle = document.createElement('canvas');
  const r = radius + blur;
  circle.width = circle.height = r * 2;

  const ctx = circle.getContext('2d')!;
  const gradient = ctx.createRadialGradient(r, r, radius * 0.2, r, r, r);
  gradient.addColorStop(0, 'rgba(0,0,0,1)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, r * 2, r * 2);

  return circle;
}

function colorize(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  minOpacity: number
): void {
  if (width === 0 || height === 0) return;

  const palette = createPalette();
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3];
    if (alpha === 0) continue;
    const paletteIndex = alpha * 4;
    pixels[i] = palette[paletteIndex];
    pixels[i + 1] = palette[paletteIndex + 1];
    pixels[i + 2] = palette[paletteIndex + 2];
    pixels[i + 3] = Math.max(alpha, Math.round(minOpacity * 255));
  }

  ctx.putImageData(imageData, 0, 0);
}

function createPalette(): Uint8ClampedArray {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  gradient.addColorStop(0.0, '#0000ff'); // 青
  gradient.addColorStop(0.35, '#00ffff'); // シアン
  gradient.addColorStop(0.6, '#00ff00'); // 緑
  gradient.addColorStop(0.8, '#ffff00'); // 黄
  gradient.addColorStop(1.0, '#ff0000'); // 赤

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  return ctx.getImageData(0, 0, 256, 1).data;
}
