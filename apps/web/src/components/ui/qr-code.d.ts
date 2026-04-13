type QRCodeSvgProps = {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  marginSize?: number;
  title?: string;
  className?: string;
  foregroundColor?: string;
  backgroundColor?: string;
};
export declare const QRCodeSvg: import("react").NamedExoticComponent<QRCodeSvgProps>;
export {};
