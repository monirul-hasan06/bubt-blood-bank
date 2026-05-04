import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { DonationHistorySection } from "@/components/DonationHistorySection";
import { Loader2, Save, CheckCircle2, MapPin, Facebook, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { BLOOD_GROUPS, DEPARTMENTS, isEligible, daysSince } from "@/lib/blood";

interface Profile {
  id: string;
  full_name: string;
  student_id: string | null;
  department: string | null;
  phone: string | null;
  blood_group: string | null;
  last_donation_date: string | null;
  is_available_to_donate: boolean;
  bio: string | null;
  location: string | null;
  facebook_url: string | null;
  whatsapp_number: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data as Profile);
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: String(fd.get("full_name") || profile.full_name).slice(0, 100),
        student_id: String(fd.get("student_id") || "").slice(0, 30) || null,
        department: String(fd.get("department") || "") || null,
        phone: String(fd.get("phone") || "").slice(0, 20),
        blood_group: (String(fd.get("blood_group") || "") || null) as any,
        last_donation_date: String(fd.get("last_donation_date") || "") || null,
        is_available_to_donate: profile.is_available_to_donate,
        bio: String(fd.get("bio") || "").slice(0, 500) || null,
        location: String(fd.get("location") || "").slice(0, 150) || null,
        facebook_url: String(fd.get("facebook_url") || "").slice(0, 250) || null,
        whatsapp_number: String(fd.get("whatsapp_number") || "").slice(0, 20) || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated!");
  };

  if (loading) {
    return (
      <Layout>
        <div className="grid place-items-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </Layout>
    );
  }

  if (!profile) return null;
  const eligible = isEligible(profile.last_donation_date);
  const days = daysSince(profile.last_donation_date);

  return (
    <Layout>
      <section className="bg-soft-gradient border-b border-border py-12">
        <div className="container">
          <div className="flex items-center gap-5">
            {profile.blood_group ? (
              <BloodGroupBadge group={profile.blood_group} size="lg" />
            ) : (
              <div className="h-16 w-16 grid place-items-center rounded-xl bg-muted text-muted-foreground text-xs">N/A</div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{profile.full_name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Donor profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" name="full_name" defaultValue={profile.full_name} required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student ID</Label>
                  <Input id="student_id" name="student_id" defaultValue={profile.student_id ?? ""} maxLength={30} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select name="department" defaultValue={profile.department ?? ""}>
                    <SelectTrigger id="department"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" defaultValue={profile.phone ?? ""} maxLength={20} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="blood_group">Blood group</Label>
                  <Select name="blood_group" defaultValue={profile.blood_group ?? ""}>
                    <SelectTrigger id="blood_group"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_donation_date">Last donation</Label>
                  <Input id="last_donation_date" name="last_donation_date" type="date" defaultValue={profile.last_donation_date ?? ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Current location</Label>
                <Input id="location" name="location" placeholder="Area, city, district" defaultValue={profile.location ?? ""} maxLength={150} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url" className="flex items-center gap-1.5"><Facebook className="h-3.5 w-3.5" /> Facebook profile</Label>
                  <Input id="facebook_url" name="facebook_url" type="url" placeholder="https://facebook.com/yourprofile" defaultValue={profile.facebook_url ?? ""} maxLength={250} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number" className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp number</Label>
                  <Input id="whatsapp_number" name="whatsapp_number" type="tel" placeholder="+8801..." defaultValue={profile.whatsapp_number ?? ""} maxLength={20} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Short bio (optional)</Label>
                <Textarea id="bio" name="bio" defaultValue={profile.bio ?? ""} maxLength={500} rows={3} />
              </div>
              <Button type="submit" variant="hero" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Availability</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Available to donate</p>
                  <p className="text-xs text-muted-foreground">Show up in donor search</p>
                </div>
                <Switch
                  checked={profile.is_available_to_donate}
                  onCheckedChange={async (checked) => {
                    setProfile((p) => p ? { ...p, is_available_to_donate: checked } : p);
                    await supabase.from("profiles").update({ is_available_to_donate: checked }).eq("id", user!.id);
                    toast.success(checked ? "You're visible to others" : "Hidden from search");
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Donation status</CardTitle></CardHeader>
            <CardContent>
              {eligible ? (
                <div className="flex items-center gap-3 text-success">
                  <CheckCircle2 className="h-8 w-8" />
                  <div>
                    <p className="font-semibold">Eligible to donate</p>
                    <p className="text-xs text-muted-foreground">
                      {days === null ? "No donations recorded" : `Last donated ${days} days ago`}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-warning">Resting period</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Donated {days} days ago. Eligible after 90 days ({90 - (days ?? 0)} to go).
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <DonationHistorySection userId={user!.id} canEdit />
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
