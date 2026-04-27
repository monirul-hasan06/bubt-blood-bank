import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  group: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BloodGroupBadge = ({ group, className, size = "md" }: Props) => {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
  };
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-xl bg-hero-gradient text-primary-foreground font-bold shadow-md",
        sizes[size],
        className
      )}
      aria-label={`Blood group ${group}`}
    >
      <Droplet className="absolute inset-0 m-auto h-full w-full opacity-20 fill-current" />
      <span className="relative">{group}</span>
    </div>
  );
};
