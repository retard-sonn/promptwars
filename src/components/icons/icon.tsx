import type { SVGProps } from "react";
import { iconDefinitions, type IconName } from "./definitions";
import { cn } from "@/lib/utils";

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  mono?: boolean;
  title?: string;
};

export function Icon({
  name,
  size = 24,
  mono = false,
  title,
  className,
  ...props
}: IconProps) {
  const definition = iconDefinitions[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={cn("icon", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d={definition.fill}
        fill={mono ? "none" : "var(--persimmon-400)"}
        stroke="none"
        className="icon-fill"
      />
      <path d={definition.path} className="icon-stroke" />
      <path
        d={definition.accent ?? "M5 5c2-2 4-2 6-2"}
        stroke="white"
        strokeOpacity="0.6"
        className="icon-highlight"
      />
    </svg>
  );
}
