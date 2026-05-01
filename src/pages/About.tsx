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

      {/* Disclaimer */}
      <div className="mt-8 rounded-2xl border border-border bg-card-gradient p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-bold">Disclaimer</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The information provided on this website is for general informational purposes only.
          Please read the points below carefully before using this service.
        </p>
        <ul className="space-y-3 text-sm">
          {[
            { t: "Verification", d: "You must verify the blood group and compatibility before donating or receiving blood." },
            { t: "Liability", d: "The website owner and its affiliates shall not be held responsible for any incorrect information or misinformation provided here." },
            { t: "Terms of use", d: "Use this information only if you agree to these terms; otherwise, please refrain from using this site." },
            { t: "Professional advice", d: "Always consult a qualified physician or an authorized blood bank before making any decisions regarding blood donation or collection." },
            { t: "Assumption of risk", d: "We do not accept any liability for any loss or damage resulting from the use of this website." },
          ].map((item) => (
            <li key={item.t} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{item.t}:</span> {item.d}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>

  </Layout>
);

export default About;
