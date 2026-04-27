import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { AlertCircle, Building2, Clock, Loader2, LockKeyhole, Phone, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreateRequestDialog } from "@/components/CreateRequestDialog";

interface BloodRequest {
  id: string;
  patient_name: string;
  blood_group: string;
  units_needed: number;
  hospital: string;
  contact_phone: string;
  urgency: "normal" | "urgent" | "critical";
  notes: string | null;
  status: "open" | "fulfilled" | "closed";
  needed_by: string | null;
  created_at: string;
  created_by: string;
}

const urgencyMap = {
  critical: { label: "Critical", className: "bg-destructive text-destructive-foreground" },
  urgent: { label: "Urgent", className: "bg-warning text-warning-foreground" },
  normal: { label: "Normal", className: "bg-secondary text-secondary-foreground" },
};

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("blood_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests((data as BloodRequest[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) load();
    else setLoading(false);
  }, [user]);

  return (
    <Layout>
      <section className="bg-soft-gradient py-12 border-b border-border">
        <div className="container flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Blood requests</h1>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Active requests from the BUBT community. Reach out if you can help.
            </p>
          </div>
          {user && (
            <Button variant="hero" size="lg" onClick={() => setOpenCreate(true)}>
              <Plus className="h-4 w-4" /> Post a request
            </Button>
          )}
        </div>
      </section>

      {!user ? (
        <section className="container py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent mb-4">
              <LockKeyhole className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Sign in to view requests</h2>
            <Button asChild variant="hero" size="lg" className="mt-6">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </section>
      ) : loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : requests.length === 0 ? (
        <div className="container py-20 text-center text-muted-foreground">
          No active requests. <button onClick={() => setOpenCreate(true)} className="text-primary underline">Be the first to post one</button>.
        </div>
      ) : (
        <section className="container py-10 grid md:grid-cols-2 gap-4">
          {requests.map((r) => {
            const u = urgencyMap[r.urgency];
            return (
              <Card key={r.id} className="hover:shadow-elegant transition-spring">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <BloodGroupBadge group={r.blood_group} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={u.className + " border-0"}>{u.label}</Badge>
                        {r.status !== "open" && <Badge variant="outline">{r.status}</Badge>}
                      </div>
                      <h3 className="mt-2 font-semibold text-lg truncate">For {r.patient_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {r.units_needed} unit{r.units_needed > 1 ? "s" : ""} needed
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4 shrink-0" /> {r.hospital}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" /> Posted {formatDistanceToNow(new Date(r.created_at))} ago
                    </p>
                    {r.notes && (
                      <p className="flex items-start gap-2 text-muted-foreground pt-1">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {r.notes}
                      </p>
                    )}
                  </div>
                  <Button asChild variant="hero" className="w-full mt-5">
                    <a href={`tel:${r.contact_phone}`}>
                      <Phone className="h-4 w-4" /> Call {r.contact_phone}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      <CreateRequestDialog open={openCreate} onOpenChange={setOpenCreate} onCreated={load} />
    </Layout>
  );
};

export default Requests;
