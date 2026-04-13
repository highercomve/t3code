import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { QrCode } from "@t3tools/shared/qrCode";
const ERROR_CORRECTION_LEVELS = {
  L: QrCode.Ecc.LOW,
  M: QrCode.Ecc.MEDIUM,
  Q: QrCode.Ecc.QUARTILE,
  H: QrCode.Ecc.HIGH,
};
function buildQrPathData(qrCode, marginSize) {
  const commands = [];
  for (let y = 0; y < qrCode.size; y += 1) {
    let runStart = -1;
    for (let x = 0; x <= qrCode.size; x += 1) {
      const isDark = x < qrCode.size && qrCode.getModule(x, y);
      if (isDark) {
        if (runStart === -1) {
          runStart = x;
        }
        continue;
      }
      if (runStart === -1) {
        continue;
      }
      commands.push(
        `M${runStart + marginSize} ${y + marginSize}h${x - runStart}v1H${runStart + marginSize}z`,
      );
      runStart = -1;
    }
  }
  return commands.join("");
}
export const QRCodeSvg = memo(function QRCodeSvg({
  value,
  size = 128,
  level = "L",
  marginSize = 0,
  title,
  className,
  foregroundColor = "#000",
  backgroundColor = "#fff",
}) {
  const qrCode = QrCode.encodeText(value, ERROR_CORRECTION_LEVELS[level]);
  const viewBoxSize = qrCode.size + marginSize * 2;
  return _jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: `0 0 ${viewBoxSize} ${viewBoxSize}`,
    width: size,
    height: size,
    shapeRendering: "crispEdges",
    role: title ? "img" : undefined,
    "aria-label": title,
    className: className,
    children: [
      title ? _jsx("title", { children: title }) : null,
      _jsx("rect", { width: viewBoxSize, height: viewBoxSize, fill: backgroundColor }),
      _jsx("path", { d: buildQrPathData(qrCode, marginSize), fill: foregroundColor }),
    ],
  });
});
