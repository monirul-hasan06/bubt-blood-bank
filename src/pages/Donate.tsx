import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Heart, Smartphone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const BKASH_NUMBER = "01318080805";

const Donate = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(BKASH_NUMBER);
    setCopied(true);
    toast.success("bKash number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <section className="container py-12 max-w-3xl">
        <div className="text-center mb-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            Support BUBT Blood Bank
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold">
            Help keep this service <span className="text-gradient">free & running.</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Your donation covers hosting, domain, and future improvements — and supports
            the student developer who maintains this platform for the BUBT community.
          </p>
        </div>

        <Card className="shadow-elegant border-border/60 overflow-hidden">
          <div className="bg-hero-gradient p-6 text-primary-foreground text-center">
            <div className="text-sm font-medium opacity-90">Send bKash to (Personal)</div>
            <div className="text-3xl sm:text-4xl font-bold tracking-wide mt-2">{BKASH_NUMBER}</div>
          </div>
          <CardContent className="p-6 sm:p-8 grid sm:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-2xl border border-border shadow-sm">
                <QRCodeSVG
                  value={`https://bkash.com/send?number=${BKASH_NUMBER}`}
                  size={180}
                  level="M"
                  marginSize={1}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                <Smartphone className="h-3 w-3" /> Scan with your camera app
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How to donate</h3>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Open your <strong>bKash</strong> app</li>
                  <li>Tap <strong>Send Money</strong></li>
                  <li>Enter <strong>{BKASH_NUMBER}</strong></li>
                  <li>Enter any amount — every taka helps ❤️</li>
                </ol>
              </div>
              <Button variant="hero" size="lg" className="w-full" onClick={copy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy bKash number"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                This is a personal account — bKash does not charge the sender on Send Money.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          Thank you for keeping BUBT Blood Bank alive. 🩸
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
