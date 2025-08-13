import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const contentType = "image/png";
export const size = { width: 180, height: 180 };

export default function AppleIcon() {
  const { width: w, height: h } = size;
  const bg = "#e6f2ff";
  const iris = "#60a5fa";
  const pupil = "#0f172a";
  const stroke = "#0ea5e9";
  const eyeW = Math.max(2, w * 0.84);
  const eyeH = Math.max(2, h * 0.56);
  const rIris = Math.max(1, Math.min(w, h) * 0.22 * 2);
  const rPupil = Math.max(1, Math.min(w, h) * 0.095 * 2);
  return new ImageResponse(
    (
      <div
        style={{
          width: w,
          height: h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
          borderRadius: 32,
        }}
      >
        <div
          style={{
            width: eyeW,
            height: eyeH,
            backgroundColor: "#ffffff",
            borderRadius: eyeH / 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: rIris * 2,
              height: rIris * 2,
              backgroundColor: iris,
              borderRadius: rIris,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: rPupil * 2,
                height: rPupil * 2,
                backgroundColor: pupil,
                borderRadius: rPupil,
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  );
}
