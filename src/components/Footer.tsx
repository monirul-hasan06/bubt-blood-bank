import { Droplet, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-border bg-secondary/30">
    <div className="container py-12 grid gap-8 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-hero-gradient">
            <Droplet className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
          </span>
          BUBT Blood Bank
        </div>
        <p className="mt-4 text-sm text-muted-foreground max-w-md">
          A student-run blood donation network at Bangladesh University of Business and
          Technology. Connecting donors with patients in need, one drop at a time.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/donors" className="hover:text-primary transition-base">Find Donors</Link></li>
          <li><Link to="/requests" className="hover:text-primary transition-base">Blood Requests</Link></li>
          <li><Link to="/about" className="hover:text-primary transition-base">About BUBT BBC</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Contact</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Rupnagar, Mirpur-2, Dhaka</li>
          <li>dev.get.in.touch@gmail.com</li>
          <li>+880 1521796217</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Disclaimer</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>The information provided on this website is for general informational purposes only.
Verification: You must verify the blood group and compatibility before donating or receiving blood.
Liability: The website owner and its affiliates shall not be held responsible for any incorrect information or misinformation provided here. Use this information only if you agree to these terms; otherwise, please refrain from using this site.
Professional Advice: Always consult a qualified physician or an authorized blood bank before making any decisions regarding blood donation or collection.
Assumption of Risk: We do not accept any liability for any loss or damage resulting from the use of this website.</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border py-6">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} BUBT Blood Bank. All rights reserved.</p>
      <p className="flex items-center gap-1">
  Made by - <a href="https://www.facebook.com/monirul.hasan06" style={{ color: 'green' }}>Monirul Hasan Mithu</a>
</p>
      </div>
    </div>
  </footer>
);
