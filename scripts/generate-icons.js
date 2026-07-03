'use strict';

// ============================================================
// 冷蔵庫☆因数分解 — PWA アイコン生成スクリプト
// 外部依存なし（Node 組み込みの zlib のみ）で PNG を生成します。
//   実行: node scripts/generate-icons.js
// ブランドカラーのピンク背景に、白い冷蔵庫のシルエットを描画します。
// 背景を全面に塗るため、maskable アイコンとしても安全です。
// ============================================================

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---- PNG エンコード ----
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // フィルタバイト(0)付きの生データ
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- 描画 ----
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

// 角丸矩形の内部判定（内側にあれば true）
function insideRoundRect(px, py, x0, y0, x1, y1, r) {
  if (px < x0 || px > x1 || py < y0 || py > y1) return false;
  const cx = Math.min(Math.max(px, x0 + r), x1 - r);
  const cy = Math.min(Math.max(py, y0 + r), y1 - r);
  const dx = px - cx, dy = py - cy;
  return dx * dx + dy * dy <= r * r;
}

// 高解像度で描画してから縮小することでアンチエイリアスを得る
function renderIcon(size, transparentBg = false) {
  const SS = 4; // スーパーサンプリング倍率
  const S = size * SS;
  const hi = Buffer.alloc(S * S * 4);

  // ブランドカラー
  const bgTop = [0xff, 0x9e, 0xb8];
  const bgBottom = [0xfb, 0x6f, 0x92];
  const white = [0xff, 0xff, 0xff];
  const pink = [0xfb, 0x6f, 0x92];

  // 冷蔵庫本体の座標（正規化 0..1 を S にスケール）
  const bodyX0 = 0.30 * S, bodyX1 = 0.70 * S;
  const bodyY0 = 0.19 * S, bodyY1 = 0.81 * S;
  const bodyR = 0.055 * S;
  const dividerY = 0.44 * S;
  const dividerH = 0.018 * S;
  // 取っ手（各扉の右寄り）
  const handleX0 = 0.605 * S, handleX1 = 0.645 * S;
  const handleUpperY0 = 0.25 * S, handleUpperY1 = 0.40 * S;
  const handleLowerY0 = 0.49 * S, handleLowerY1 = 0.64 * S;
  const handleR = 0.020 * S;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let r, g, b, a = 255;

      // 背景（縦グラデーション）
      const t = y / (S - 1);
      r = Math.round(lerp(bgTop[0], bgBottom[0], t));
      g = Math.round(lerp(bgTop[1], bgBottom[1], t));
      b = Math.round(lerp(bgTop[2], bgBottom[2], t));
      if (transparentBg) a = 0;

      const cx = x + 0.5, cy = y + 0.5;

      // 冷蔵庫本体（白）
      if (insideRoundRect(cx, cy, bodyX0, bodyY0, bodyX1, bodyY1, bodyR)) {
        r = white[0]; g = white[1]; b = white[2]; a = 255;

        // 扉の仕切り線（ピンク）
        if (cy >= dividerY - dividerH / 2 && cy <= dividerY + dividerH / 2) {
          r = pink[0]; g = pink[1]; b = pink[2];
        }
        // 取っ手（ピンク）
        if (
          insideRoundRect(cx, cy, handleX0, handleUpperY0, handleX1, handleUpperY1, handleR) ||
          insideRoundRect(cx, cy, handleX0, handleLowerY0, handleX1, handleLowerY1, handleR)
        ) {
          r = pink[0]; g = pink[1]; b = pink[2];
        }
      }

      const o = (y * S + x) * 4;
      hi[o] = r; hi[o + 1] = g; hi[o + 2] = b; hi[o + 3] = a;
    }
  }

  // ボックスフィルタで size へ縮小
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let R = 0, G = 0, B = 0, A = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const o = ((y * SS + sy) * S + (x * SS + sx)) * 4;
          const al = hi[o + 3];
          R += hi[o] * al; G += hi[o + 1] * al; B += hi[o + 2] * al; A += al;
        }
      }
      const o = (y * size + x) * 4;
      if (A === 0) {
        out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
      } else {
        out[o] = Math.round(R / A);
        out[o + 1] = Math.round(G / A);
        out[o + 2] = Math.round(B / A);
        out[o + 3] = Math.round(A / (SS * SS));
      }
    }
  }
  return out;
}

// ---- 出力 ----
const outDir = path.join(__dirname, '..', 'icons');
fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
];

for (const t of targets) {
  const rgba = renderIcon(t.size);
  const png = encodePNG(t.size, t.size, rgba);
  fs.writeFileSync(path.join(outDir, t.name), png);
  console.log(`generated icons/${t.name} (${t.size}x${t.size}, ${png.length} bytes)`);
}
