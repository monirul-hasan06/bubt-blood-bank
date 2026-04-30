import { useState } from "react";
import { Copy, Check, Coffee, Heart, Smartphone, Sparkles } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BKASH_NUMBER = "01318080805";
const PRESETS = [
  { coffees: 1, taka: 50, emoji: "☕" },
  { coffees: 3, taka: 150, emoji: "☕☕☕" },
  { coffees: 5, taka: 250, emoji: "🎉" },
  { coffees: 10, taka: 500, emoji: "💖" },
];

const Support = () => {
  const [selected, setSelected] = useState(1);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(BKASH_NUMBER);
    setCopied(true);
    toast.success("bKash number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const current = PRESETS[selected];

  return (
    <Layout>
      <section className="container py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-hero-gradient shadow-elegant mb-5">
            <Coffee className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Buy us a <span className="text-gradient">coffee ☕</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Hi! We are the student dev keeping BUBT Blood Bank free & running.
            Your support covers hosting, domain, and late-night code sessions. 🩸
          </p>
        </div>

        {/* Card */}
        <Card className="shadow-elegant border-border/60 overflow-hidden bg-card-gradient">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Amount picker */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                <Coffee className="h-4 w-4 text-primary" />
                <span>Pick how many coffees</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.coffees}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-spring",
                      selected === i
                        ? "border-primary bg-accent text-accent-foreground shadow-md scale-105"
                        : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"
                    )}
                  >
                    <span className="text-lg leading-none">{p.emoji}</span>
                    <span className="text-xs font-semibold mt-1">×{p.coffees}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="rounded-2xl border border-border bg-background p-5 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Suggested amount
              </div>
              <div className="mt-1 text-4xl font-bold text-gradient">
                ৳ {current.taka}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Or send any amount you like
              </div>
            </div>

            {/* bKash number */}
            <div className="rounded-2xl bg-hero-gradient p-5 text-primary-foreground">
              <div className="flex items-center gap-2 text-xs font-medium opacity-90">
                <Smartphone className="h-3.5 w-3.5" />
                Send bKash to (Personal)
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="text-2xl sm:text-3xl font-bold tracking-wide">
                  {BKASH_NUMBER}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copy}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            {/* Steps */}
            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Sparkles className="h-4 w-4 text-primary" /> How it works
              </div>
              <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                <li>Open your <strong className="text-foreground">bKash</strong> app</li>
                <li>Tap <strong className="text-foreground">Send Money</strong></li>
                <li>Paste the number above & send any amount</li>
              </ol>
            </div>

            {/* Footer line */}
            <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <className="h-3.5 w-3.5 fill-primary text-primary" />
              Every taka keeps the platform alive — thank you!
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Support;
