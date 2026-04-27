import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BLOOD_GROUPS, isEligible, daysSince } from "@/lib/blood";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Phone, Search, GraduationCap, MapPin, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

interface DonorProfile {
  id: string;
  full_name: string;
  blood_group: string | null;
  department: string | null;
  phone: string | null;
  last_donation_date: string | null;
  is_available_to_donate: boolean;
  bio: string | null;
}

const Donors = () => {
  const { user } = useAuth();
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [bgFilter, setBgFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, blood_group, department, phone, last_donation_date, is_available_to_donate, bio")
        .eq("is_available_to_donate", true)
        .order("created_at", { ascending: false });
      if (!error && data) setDonors(data as DonorProfile[]);
      setLoading(false);
    })();
  }, [user]);

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      const matchesBG = bgFilter === "all" || d.blood_group === bgFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        d.full_name.toLowerCase().includes(q) ||
        (d.department || "").toLowerCase().includes(q);
      return matchesBG && matchesSearch;
    });
  }, [donors, bgFilter, search]);

  return (
    <Layout>
      <section className="bg-soft-gradient py-12 border-b border-border">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl font-bold">Find a donor</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Browse active BUBT student donors. Filter by blood group and reach out directly.
          </p>
        </div>
      </section>

      {!user ? (
        <section className="container py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent mb-4">
              <LockKeyhole className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Sign in to view donors</h2>
            <p className="mt-2 text-muted-foreground">
              Donor contact info is only visible to verified BUBT students.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-6">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </section>
      ) : (
        <section className="container py-10">
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or department"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={bgFilter} onValueChange={setBgFilter}>
              <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All blood groups</SelectItem>
                {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No donors match your filters yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((d) => {
                const eligible = isEligible(d.last_donation_date);
                const days = daysSince(d.last_donation_date);
                return (
                  <Card key={d.id} className="hover:shadow-elegant hover:-translate-y-0.5 transition-spring">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {d.blood_group ? (
                          <BloodGroupBadge group={d.blood_group} />
                        ) : (
                          <div className="h-12 w-12 grid place-items-center rounded-xl bg-muted text-muted-foreground text-xs">N/A</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{d.full_name}</h3>
                          {d.department && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <GraduationCap className="h-3 w-3" /> {d.department}
                            </p>
                          )}
                          <div className="mt-2">
                            {eligible ? (
                              <Badge className="bg-success/10 text-success hover:bg-success/15 border-0">
                                Available now
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                {days !== null ? `Donated ${days}d ago` : "Resting"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {d.bio && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{d.bio}</p>}
                      {d.phone && (
                        <Button asChild variant="outline" size="sm" className="w-full mt-4">
                          <a href={`tel:${d.phone}`}><Phone className="h-4 w-4" /> {d.phone}</a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}
    </Layout>
  );
};

export default Donors;
