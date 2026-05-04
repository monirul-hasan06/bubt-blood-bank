import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { BLOOD_GROUPS, isEligible, daysSince } from "@/lib/blood";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Phone, Search, GraduationCap, MapPin, Facebook, MessageCircle, Droplet } from "lucide-react";

interface DonorEntry {
  id: string;
  user_id?: string;
  full_name: string;
  blood_group: string | null;
  department: string | null;
  phone: string | null;
  last_donation_date: string | null;
  bio: string | null;
  location?: string | null;
  facebook_url?: string | null;
  whatsapp_number?: string | null;
  donation_count?: number;
  source: "registered" | "community";
}

const Donors = () => {
  const [donors, setDonors] = useState<DonorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [bgFilter, setBgFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const [profilesRes, publicRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, blood_group, department, phone, last_donation_date, bio, location, facebook_url, whatsapp_number")
          .eq("is_available_to_donate", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("public_donors")
          .select("id, full_name, blood_group, phone, note")
          .eq("is_visible", true)
          .order("created_at", { ascending: false }),
      ]);

      const profiles = profilesRes.data || [];
      const userIds = profiles.map((p: any) => p.id);
      const counts: Record<string, number> = {};
      if (userIds.length) {
        const { data: hist } = await supabase
          .from("donation_history")
          .select("user_id")
          .in("user_id", userIds);
        (hist || []).forEach((h: any) => { counts[h.user_id] = (counts[h.user_id] || 0) + 1; });
      }

      const registered: DonorEntry[] = profiles.map((p: any) => ({
        id: `r-${p.id}`,
        user_id: p.id,
        full_name: p.full_name,
        blood_group: p.blood_group,
        department: p.department,
        phone: p.phone,
        last_donation_date: p.last_donation_date,
        bio: p.bio,
        location: p.location,
        facebook_url: p.facebook_url,
        whatsapp_number: p.whatsapp_number,
        donation_count: counts[p.id] || 0,
        source: "registered",
      }));

      const community: DonorEntry[] = (publicRes.data || []).map((p: any) => ({
        id: `c-${p.id}`,
        full_name: p.full_name,
        blood_group: p.blood_group,
        department: null,
        phone: p.phone,
        last_donation_date: null,
        bio: p.note,
        source: "community",
      }));

      setDonors([...registered, ...community]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      const matchesBG = bgFilter === "all" || d.blood_group === bgFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        d.full_name.toLowerCase().includes(q) ||
        (d.department || "").toLowerCase().includes(q) ||
        (d.phone || "").toLowerCase().includes(q);
      return matchesBG && matchesSearch;
    });
  }, [donors, bgFilter, search]);

  return (
    <Layout>
      <section className="bg-soft-gradient py-12 border-b border-border">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl font-bold">Find a donor</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Browse BUBT student blood donors. Filter by group and call directly.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, department, or phone"
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
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filtered.length} donor{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((d) => {
                const eligible = d.source === "community" ? true : isEligible(d.last_donation_date);
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
                          {d.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" /> {d.location}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {eligible ? (
                              <Badge className="bg-success/10 text-success hover:bg-success/15 border-0">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                {days !== null ? `Donated ${days}d ago` : "Resting"}
                              </Badge>
                            )}
                            {!!d.donation_count && d.donation_count > 0 && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Droplet className="h-3 w-3 text-primary" /> {d.donation_count}x donated
                              </Badge>
                            )}
                            {d.source === "community" && (
                              <Badge variant="outline" className="text-xs">Community</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {d.bio && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{d.bio}</p>}
                      <div className="mt-4 grid grid-cols-1 gap-2">
                        {d.phone && (
                          <Button asChild variant="outline" size="sm">
                            <a href={`tel:${d.phone}`}><Phone className="h-4 w-4" /> {d.phone}</a>
                          </Button>
                        )}
                        <div className="flex gap-2">
                          {d.whatsapp_number && (
                            <Button asChild size="sm" className="flex-1 bg-[#25D366] hover:bg-[#1ebe57] text-white">
                              <a href={`https://wa.me/${d.whatsapp_number.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4" /> WhatsApp
                              </a>
                            </Button>
                          )}
                          {d.facebook_url && (
                            <Button asChild size="sm" variant="outline" className="flex-1">
                              <a href={d.facebook_url} target="_blank" rel="noopener noreferrer">
                                <Facebook className="h-4 w-4" /> Facebook
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default Donors;
