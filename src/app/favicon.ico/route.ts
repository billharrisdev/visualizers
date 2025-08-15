import { ImageResponse } from "next/og";

export const dynamic = "force-static";

// Generate a tiny 16x16 PNG at /favicon.ico (browsers accept PNG here)
export async function GET() {
  const size = 16;
  const w = size;
  const h = size;
  const bg = "#e6f2ff";
  const iris = "#60a5fa";
  const pupil = "#0f172a";
  const eyeW = Math.max(2, w * 0.84);
  const eyeH = Math.max(2, h * 0.56);
  const rIris = Math.max(1, Math.min(w, h) * 0.44 * 0.5);
  const rPupil = Math.max(1, Math.min(w, h) * 0.19 * 0.5);

  const image = new ImageResponse(
    (
      <div
        style={{
          width: w,
          height: h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
          borderRadius: Math.max(2, w * 0.15),
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
    { width: w, height: h }
  );

  return image;
}
