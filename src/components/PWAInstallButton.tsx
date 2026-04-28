import { Download, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  variant?: "default" | "ghost" | "outline" | "hero";
  size?: "sm" | "default" | "lg";
  className?: string;
  showLabel?: boolean;
}

export const PWAInstallButton = ({
  variant = "outline",
  size = "sm",
  className,
  showLabel = true,
}: Props) => {
  const { canInstall, install, isIOS } = usePWAInstall();
  const [iosOpen, setIosOpen] = useState(false);

  if (!canInstall) return null;

  const handleClick = async () => {
    if (isIOS) {
      setIosOpen(true);
      return;
    }
    const ok = await install();
    if (ok) toast.success("App installed!");
  };

  return (
    <>
      <Button variant={variant} size={size} onClick={handleClick} className={className}>
        <Download className="h-4 w-4" />
        {showLabel && <span>Install App</span>}
      </Button>
      <Dialog open={iosOpen} onOpenChange={setIosOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install on iPhone / iPad</DialogTitle>
            <DialogDescription>Add this app to your Home Screen in 2 steps:</DialogDescription>
          </DialogHeader>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3 items-start">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground font-semibold">1</span>
              <span>Tap the <Share className="inline h-4 w-4 mx-1" /> <strong>Share</strong> button in Safari.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground font-semibold">2</span>
              <span>Choose <Plus className="inline h-4 w-4 mx-1" /> <strong>Add to Home Screen</strong>.</span>
            </li>
          </ol>
        </DialogContent>
      </Dialog>
    </>
  );
};
