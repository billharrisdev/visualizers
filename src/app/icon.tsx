import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const contentType = "image/png";
export const sizes = [16, 32];

export default function Icon({ size = 32 }: { size?: number }) {
  const w = size;
  const h = size;
  const bg = "#e6f2ff";
  const iris = "#60a5fa";
  const pupil = "#0f172a";
  const eyeW = Math.max(2, w * 0.84);
  const eyeH = Math.max(2, h * 0.56);
  const rIris = Math.max(1, Math.min(w, h) * 0.44 * 0.5);
  const rPupil = Math.max(1, Math.min(w, h) * 0.19 * 0.5);

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
          borderRadius: Math.max(2, w * 0.15),
        }}
      >
        {/* Eye white */}
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
          {/* Iris */}
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
            {/* Pupil */}
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
}
