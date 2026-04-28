import { Link, NavLink, useNavigate } from "react-router-dom";
import { Droplet, Heart, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { to: "/donors", label: "Find Donors" },
  { to: "/requests", label: "Blood Requests" },
  { to: "/donate", label: "Donate" },
  { to: "/about", label: "About" },
];

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-hero-gradient shadow-md">
            <Droplet className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
          </span>
          <span>BUBT <span className="text-gradient">Blood Bank</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-base inline-flex items-center gap-1.5",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}>
              {l.to === "/donate" && <Heart className="h-3.5 w-3.5 fill-primary text-primary" />}
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/dashboard"><ShieldCheck className="h-4 w-4" /> Admin</Link>
                </Button>
              )}
              <Button variant="ghost" asChild><Link to="/dashboard">Dashboard</Link></Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/auth">Sign in</Link></Button>
              <Button variant="hero" asChild><Link to="/auth?mode=signup">Become a donor</Link></Button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button className="p-2 rounded-lg hover:bg-muted" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={({ isActive }) => cn(
                  "px-4 py-3 rounded-lg text-sm font-medium",
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                )}>
                {l.label}
              </NavLink>
            ))}
            <div className="border-t border-border pt-3 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" asChild className="justify-start">
                      <Link to="/admin/dashboard" onClick={() => setOpen(false)}>
                        <ShieldCheck className="h-4 w-4" /> Admin dashboard
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" /> Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth" onClick={() => setOpen(false)}>Sign in</Link>
                  </Button>
                  <Button variant="hero" asChild>
                    <Link to="/auth?mode=signup" onClick={() => setOpen(false)}>Become a donor</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
