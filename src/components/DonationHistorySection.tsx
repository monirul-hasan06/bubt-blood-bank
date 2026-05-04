import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Droplet, Calendar, MapPin, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface DonationRecord {
  id: string;
  user_id: string;
  donation_date: string | null;
  hospital: string | null;
  location: string | null;
  notes: string | null;
}

interface Props {
  userId: string;
  canEdit: boolean;
}

export const DonationHistorySection = ({ userId, canEdit }: Props) => {
  const [records, setRecords] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DonationRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("donation_history")
      .select("*")
      .eq("user_id", userId)
      .order("donation_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    setRecords((data as DonationRecord[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [userId]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      user_id: userId,
      donation_date: (String(fd.get("donation_date") || "") || null) as string | null,
      hospital: (String(fd.get("hospital") || "").slice(0, 150) || null) as string | null,
      location: (String(fd.get("location") || "").slice(0, 150) || null) as string | null,
      notes: (String(fd.get("notes") || "").slice(0, 500) || null) as string | null,
    };
    setSaving(true);
    const { error } = editing
      ? await supabase.from("donation_history").update(payload).eq("id", editing.id)
      : await supabase.from("donation_history").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Donation updated" : "Donation added");
    setOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this donation record?")) return;
    const { error } = await supabase.from("donation_history").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">
            Donation history
            <Badge variant="secondary" className="ml-2">{records.length} {records.length === 1 ? "time" : "times"}</Badge>
          </CardTitle>
        </div>
        {canEdit && (
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" variant="hero" onClick={() => setEditing(null)}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit donation" : "Add donation"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="donation_date">Donation date (optional)</Label>
                  <Input id="donation_date" name="donation_date" type="date" defaultValue={editing?.donation_date ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital / Organization (optional)</Label>
                  <Input id="hospital" name="hospital" maxLength={150} defaultValue={editing?.hospital ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input id="location" name="location" maxLength={150} defaultValue={editing?.location ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" name="notes" maxLength={500} rows={3} defaultValue={editing?.notes ?? ""} />
                </div>
                <DialogFooter>
                  <Button type="submit" variant="hero" disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : records.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No donations recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {records.map((r) => (
              <li key={r.id} className="rounded-lg border border-border bg-card/50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      {r.donation_date && (
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {new Date(r.donation_date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      )}
                      {r.hospital && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" /> {r.hospital}
                        </span>
                      )}
                      {r.location && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> {r.location}
                        </span>
                      )}
                    </div>
                    {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                  </div>
                  {canEdit && (
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(r); setOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(r.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
