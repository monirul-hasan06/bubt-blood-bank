import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { BLOOD_GROUPS } from "@/lib/blood";
import { Loader2, Pencil, Trash2, ShieldCheck, Coffee } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Profile = {
  id: string; full_name: string; student_id: string | null;
  department: string | null; phone: string | null;
  blood_group: string | null; is_available_to_donate: boolean;
};
type BloodRequest = {
  id: string; patient_name: string; blood_group: string; units_needed: number;
  hospital: string; contact_phone: string; urgency: string; status: string;
  notes: string | null; needed_by: string | null; created_by: string;
};
type PublicDonor = {
  id: string; full_name: string; blood_group: string; phone: string;
  note: string | null; is_visible: boolean;
};

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [publicDonors, setPublicDonors] = useState<PublicDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [supportVisible, setSupportVisible] = useState(true);
  const [savingSetting, setSavingSetting] = useState(false);

  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [editRequest, setEditRequest] = useState<BloodRequest | null>(null);
  const [editDonor, setEditDonor] = useState<PublicDonor | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ kind: "profile" | "request" | "donor"; id: string; label: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const [p, r, d] = await Promise.all([
      supabase.from("profiles").select("*").order("full_name"),
      supabase.from("blood_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("public_donors").select("*").order("full_name"),
    ]);
    if (p.data) setProfiles(p.data as Profile[]);
    if (r.data) setRequests(r.data as BloodRequest[]);
    if (d.data) setPublicDonors(d.data as PublicDonor[]);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const runDelete = async () => {
    if (!confirmDelete) return;
    const { kind, id } = confirmDelete;
    const table = kind === "profile" ? "profiles" : kind === "request" ? "blood_requests" : "public_donors";
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      setConfirmDelete(null);
      await load();
    }
  };

  const saveProfile = async () => {
    if (!editProfile) return;
    const { id, full_name, student_id, department, phone, blood_group, is_available_to_donate } = editProfile;
    const { error } = await supabase.from("profiles").update({
      full_name, student_id, department, phone,
      blood_group: blood_group as any, is_available_to_donate,
    }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Profile updated"); setEditProfile(null); void load(); }
  };

  const saveRequest = async () => {
    if (!editRequest) return;
    const { id, patient_name, blood_group, units_needed, hospital, contact_phone, urgency, status, notes } = editRequest;
    const { error } = await supabase.from("blood_requests").update({
      patient_name, blood_group: blood_group as any, units_needed, hospital, contact_phone,
      urgency: urgency as any, status: status as any, notes,
    }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Request updated"); setEditRequest(null); void load(); }
  };

  const saveDonor = async () => {
    if (!editDonor) return;
    const { id, full_name, blood_group, phone, note, is_visible } = editDonor;
    const { error } = await supabase.from("public_donors").update({
      full_name, blood_group: blood_group as any, phone, note, is_visible,
    }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Donor updated"); setEditDonor(null); void load(); }
  };

  return (
    <Layout>
      <section className="container py-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-hero-gradient shadow-md">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </span>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Moderate users, requests, and community donors.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid place-items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users">Users ({profiles.length})</TabsTrigger>
              <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
              <TabsTrigger value="donors">Community Donors ({publicDonors.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader><CardTitle>Registered Users</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground border-b border-border">
                      <tr>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Blood</th>
                        <th className="py-2 pr-4">Department</th>
                        <th className="py-2 pr-4">Phone</th>
                        <th className="py-2 pr-4">Available</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((p) => (
                        <tr key={p.id} className="border-b border-border/60">
                          <td className="py-3 pr-4 font-medium">{p.full_name}</td>
                          <td className="py-3 pr-4">{p.blood_group ? <BloodGroupBadge group={p.blood_group as any} size="sm" /> : "—"}</td>
                          <td className="py-3 pr-4">{p.department || "—"}</td>
                          <td className="py-3 pr-4">{p.phone || "—"}</td>
                          <td className="py-3 pr-4">{p.is_available_to_donate ? "Yes" : "No"}</td>
                          <td className="py-3 flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setEditProfile(p)}><Pencil className="h-4 w-4" /></Button>
                            <Button size="sm" variant="destructive"
                              onClick={() => setConfirmDelete({ kind: "profile", id: p.id, label: p.full_name })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {profiles.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No users yet.</td></tr>}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <Card>
                <CardHeader><CardTitle>Blood Requests</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground border-b border-border">
                      <tr>
                        <th className="py-2 pr-4">Patient</th>
                        <th className="py-2 pr-4">Blood</th>
                        <th className="py-2 pr-4">Units</th>
                        <th className="py-2 pr-4">Hospital</th>
                        <th className="py-2 pr-4">Urgency</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.id} className="border-b border-border/60">
                          <td className="py-3 pr-4 font-medium">{r.patient_name}</td>
                          <td className="py-3 pr-4"><BloodGroupBadge group={r.blood_group as any} size="sm" /></td>
                          <td className="py-3 pr-4">{r.units_needed}</td>
                          <td className="py-3 pr-4">{r.hospital}</td>
                          <td className="py-3 pr-4 capitalize">{r.urgency}</td>
                          <td className="py-3 pr-4 capitalize">{r.status}</td>
                          <td className="py-3 flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setEditRequest(r)}><Pencil className="h-4 w-4" /></Button>
                            <Button size="sm" variant="destructive"
                              onClick={() => setConfirmDelete({ kind: "request", id: r.id, label: r.patient_name })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No requests yet.</td></tr>}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donors">
              <Card>
                <CardHeader><CardTitle>Community Donors (imported list)</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground border-b border-border">
                      <tr>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Blood</th>
                        <th className="py-2 pr-4">Phone</th>
                        <th className="py-2 pr-4">Visible</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {publicDonors.map((d) => (
                        <tr key={d.id} className="border-b border-border/60">
                          <td className="py-3 pr-4 font-medium">{d.full_name}</td>
                          <td className="py-3 pr-4"><BloodGroupBadge group={d.blood_group as any} size="sm" /></td>
                          <td className="py-3 pr-4">{d.phone}</td>
                          <td className="py-3 pr-4">{d.is_visible ? "Yes" : "No"}</td>
                          <td className="py-3 flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setEditDonor(d)}><Pencil className="h-4 w-4" /></Button>
                            <Button size="sm" variant="destructive"
                              onClick={() => setConfirmDelete({ kind: "donor", id: d.id, label: d.full_name })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </section>

      {/* Delete confirmation */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {confirmDelete?.kind}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{confirmDelete?.label}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit profile dialog */}
      <Dialog open={!!editProfile} onOpenChange={(o) => !o && setEditProfile(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit user profile</DialogTitle></DialogHeader>
          {editProfile && (
            <div className="space-y-3">
              <div><Label>Full name</Label><Input value={editProfile.full_name} onChange={(e) => setEditProfile({ ...editProfile, full_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Student ID</Label><Input value={editProfile.student_id || ""} onChange={(e) => setEditProfile({ ...editProfile, student_id: e.target.value })} /></div>
                <div><Label>Department</Label><Input value={editProfile.department || ""} onChange={(e) => setEditProfile({ ...editProfile, department: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={editProfile.phone || ""} onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })} /></div>
                <div>
                  <Label>Blood group</Label>
                  <Select value={editProfile.blood_group || ""} onValueChange={(v) => setEditProfile({ ...editProfile, blood_group: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfile(null)}>Cancel</Button>
            <Button variant="hero" onClick={saveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit request dialog */}
      <Dialog open={!!editRequest} onOpenChange={(o) => !o && setEditRequest(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit blood request</DialogTitle></DialogHeader>
          {editRequest && (
            <div className="space-y-3">
              <div><Label>Patient name</Label><Input value={editRequest.patient_name} onChange={(e) => setEditRequest({ ...editRequest, patient_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Blood group</Label>
                  <Select value={editRequest.blood_group} onValueChange={(v) => setEditRequest({ ...editRequest, blood_group: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Units</Label><Input type="number" min={1} value={editRequest.units_needed} onChange={(e) => setEditRequest({ ...editRequest, units_needed: parseInt(e.target.value) || 1 })} /></div>
              </div>
              <div><Label>Hospital</Label><Input value={editRequest.hospital} onChange={(e) => setEditRequest({ ...editRequest, hospital: e.target.value })} /></div>
              <div><Label>Contact phone</Label><Input value={editRequest.contact_phone} onChange={(e) => setEditRequest({ ...editRequest, contact_phone: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Urgency</Label>
                  <Select value={editRequest.urgency} onValueChange={(v) => setEditRequest({ ...editRequest, urgency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editRequest.status} onValueChange={(v) => setEditRequest({ ...editRequest, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Notes</Label><Textarea value={editRequest.notes || ""} onChange={(e) => setEditRequest({ ...editRequest, notes: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRequest(null)}>Cancel</Button>
            <Button variant="hero" onClick={saveRequest}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit donor dialog */}
      <Dialog open={!!editDonor} onOpenChange={(o) => !o && setEditDonor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit community donor</DialogTitle></DialogHeader>
          {editDonor && (
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={editDonor.full_name} onChange={(e) => setEditDonor({ ...editDonor, full_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Blood group</Label>
                  <Select value={editDonor.blood_group} onValueChange={(v) => setEditDonor({ ...editDonor, blood_group: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Phone</Label><Input value={editDonor.phone} onChange={(e) => setEditDonor({ ...editDonor, phone: e.target.value })} /></div>
              </div>
              <div><Label>Note</Label><Textarea value={editDonor.note || ""} onChange={(e) => setEditDonor({ ...editDonor, note: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editDonor.is_visible}
                  onChange={(e) => setEditDonor({ ...editDonor, is_visible: e.target.checked })} />
                Visible on public donor list
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDonor(null)}>Cancel</Button>
            <Button variant="hero" onClick={saveDonor}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminDashboard;
