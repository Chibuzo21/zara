import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #f9a8c9 0%, #e8994a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <span
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "serif",
          fontStyle: "italic",
        }}>
        Z
      </span>
    </div>,
    { ...size },
  );
}
