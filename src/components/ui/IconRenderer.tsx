import React from "react";
import * as Icons from "lucide-react";

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = "w-5 h-5", size }) => {
  // @ts-expect-error - Dynamic lookup for Lucide icons
  const LucideIcon = Icons[name] || Icons.CircleDot;
  return <LucideIcon className={className} size={size} />;
};
