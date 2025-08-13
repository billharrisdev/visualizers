import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = { width: 180, height: 180 };

export default function AppleIcon() {
  const { width: w, height: h } = size;
  const bg = "#e6f2ff";
  const iris = "#60a5fa";
  const pupil = "#0f172a";
  const stroke = "#0ea5e9";
  const cx = w / 2;
  const cy = h / 2;
  const eyeRx = Math.max(2, w * 0.42);
  const eyeRy = Math.max(2, h * 0.28);
  const rIris = Math.max(1, Math.min(w, h) * 0.22);
  const rPupil = Math.max(1, Math.min(w, h) * 0.095);
  return new ImageResponse(
    (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={w} height={h} rx={32} fill={bg} />
        <ellipse cx={cx} cy={cy} rx={eyeRx} ry={eyeRy} fill="#fff" stroke={stroke} strokeWidth={12} />
        <circle cx={cx} cy={cy} r={rIris} fill={iris} />
        <circle cx={cx} cy={cy} r={rPupil} fill={pupil} />
      </svg>
    ),
    size
  );
}
