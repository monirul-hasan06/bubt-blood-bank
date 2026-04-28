import { Link } from "react-router-dom";
import { ArrowRight, Droplet, HeartPulse, Search, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { BLOOD_GROUPS } from "@/lib/blood";
import heroImg from "@/assets/hero-bloodbank.jpg";

const features = [
  {
    icon: Search,
    title: "Find donors instantly",
    desc: "Search active student donors by blood group and department, get connected in minutes.",
  },
  {
    icon: HeartPulse,
    title: "Post urgent requests",
    desc: "Need blood? Create a request and notify the entire BUBT donor network in one tap.",
  },
  {
    icon: ShieldCheck,
    title: "Verified students",
    desc: "Every donor is a verified BUBT student. Your safety and privacy come first.",
  },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-soft-gradient" />
      <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">
            <Droplet className="h-3.5 w-3.5 fill-primary text-primary animate-pulse-heart" />
            BUBT Student Blood Donation Network
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Every drop tells a <span className="text-gradient">story of hope.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Join hundreds of BUBT students saving lives across Bangladesh. Find a donor,
            request blood, or become someone's hero — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/auth?mode=signup">
                Become a donor <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/donors">
                <Search className="h-5 w-5" /> Find donors
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="absolute -inset-4 bg-hero-gradient opacity-20 blur-3xl rounded-full" />
          <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/40">
            <img
              src={heroImg}
              alt="BUBT students participating in blood donation"
              width={1600}
              height={1024}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/40 to-transparent pointer-events-none" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-card-gradient border border-border rounded-2xl p-4 shadow-elegant flex items-center gap-3 hidden sm:flex">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-success/10">
              <Users className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-sm font-semibold">350+ donors</div>
              <div className="text-xs text-muted-foreground">ready to help</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Blood groups strip */}
    <section className="border-y border-border bg-secondary/40 py-10">
      <div className="container">
        <p className="text-center text-sm text-muted-foreground mb-6">
          We connect donors across all 8 blood groups
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {BLOOD_GROUPS.map((g) => (
            <BloodGroupBadge key={g} group={g} size="md" />
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold">A simple way to save lives</h2>
          <p className="mt-4 text-muted-foreground">
            Built by students, for students. Everything you need to give or receive blood
            within the BUBT community.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-8 rounded-2xl border border-border bg-card-gradient hover:shadow-elegant hover:-translate-y-1 transition-spring"
            >
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-hero-gradient shadow-md mb-5 group-hover:shadow-glow transition-base">
                <f.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-4">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-10 sm:p-16 text-center shadow-elegant">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative">
            <Droplet className="h-12 w-12 mx-auto fill-primary-foreground text-primary-foreground animate-pulse-heart" />
            <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-primary-foreground">
              Your blood. Their second chance.
            </h2>
            <p className="mt-4 text-primary-foreground/90 max-w-xl mx-auto">
              One donation can save up to three lives. Add yourself to the BUBT donor
              registry today — it takes less than a minute.
            </p>
            <Button asChild size="xl" variant="secondary" className="mt-8">
              <Link to="/auth?mode=signup">Sign up as a donor</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
