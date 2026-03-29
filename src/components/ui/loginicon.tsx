import React from "react";

interface LogInIconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  background?: string;
  opacity?: number;
  rotation?: number;
  shadow?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  padding?: number;
  className?: string; // ✅ Allow Tailwind classes
}

const LogInIcon: React.FC<LogInIconProps> = ({
  size = 24,
  color = "#FFFFFF",
  strokeWidth = 2,
  background = "transparent", // ✅ Default to transparent
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0,
  className = "",
}) => {
  // Build CSS transforms array
  const transforms: string[] = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push("scaleX(-1)");
  if (flipVertical) transforms.push("scaleY(-1)");

  // Calculate viewBox with padding
  const viewBoxSize = 24 + padding * 2;
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round" // ✅ camelCase (not stroke-linecap)
      strokeLinejoin="round" // ✅ camelCase (not stroke-linejoin)
      className={className} // ✅ Allow external styling
      style={{
        opacity,
        transform: transforms.length > 0 ? transforms.join(" ") : undefined,
        filter:
          shadow > 0
            ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))`
            : undefined,
        backgroundColor: background !== "transparent" ? background : undefined,
        display: "block", // ✅ Prevent inline-svg spacing issues
        flexShrink: 0, // ✅ Prevent icon from shrinking in flex containers
      }}
    >
      {/* ✅ Fixed path: strokeWidth as prop, camelCase attributes */}
      <path
        d="M10 17l5-5-5-5m5 5H3m12-9h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth} // ✅ Fixed: was {strokeWidth} (syntax error)
      />
    </svg>
  );
};

export default LogInIcon;
