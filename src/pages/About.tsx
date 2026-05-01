import { Layout } from "@/components/Layout";
import { AlertTriangle, Droplet, GraduationCap, HeartHandshake, ShieldCheck } from "lucide-react";

const About = () => (
  <Layout>
    <section className="bg-soft-gradient py-16 border-b border-border">
      <div className="container max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold">About BUBT Blood Bank</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A student-led initiative at Bangladesh University of Business and Technology
          dedicated to bridging the gap between blood donors and patients in need.
        </p>
      </div>
    </section>

      <section className="container py-16 max-w-3xl space-y-8">
      <div className="prose prose-neutral max-w-none">
        <h2 className="text-2xl font-bold">Our mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          Every year, thousands of patients in Bangladesh face critical blood shortages.
          BUBT Blood Bank is built by students, for students — and the wider community —
          to make finding a donor as easy as a few taps on a phone.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: GraduationCap, title: "Student-powered", desc: "Run by BUBT volunteers from every department." },
          { icon: HeartHandshake, title: "Community first", desc: "Free service for students, families, and beyond." },
          { icon: ShieldCheck, title: "Privacy protected", desc: "Donor info only visible to verified members." },
          { icon: Droplet, title: "All blood groups", desc: "Active donors across all 8 groups, year-round." },
        ].map((f) => (
          <div key={f.title} className="p-5 rounded-2xl border border-border bg-card-gradient">
            <f.icon className="h-7 w-7 text-primary mb-3" />
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-accent">
        <h3 className="font-semibold">Get involved</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Want to volunteer with BUBT Blood Bank Club? Email us at{" "}
          <a href="mailto: dev.get.in.touch@gmail.com" className="text-primary underline">
            dev.get.in.touch@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  </Layout>
);

export default About;
