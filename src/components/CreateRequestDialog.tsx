import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BLOOD_GROUPS, URGENCY } from "@/lib/blood";

const schema = z.object({
  patient_name: z.string().trim().min(2, "Patient name required").max(100),
  blood_group: z.string().min(1, "Select blood group"),
  units_needed: z.number().int().min(1).max(20),
  hospital: z.string().trim().min(2, "Hospital required").max(150),
  contact_phone: z.string().trim().min(7, "Phone required").max(20),
  urgency: z.enum(["normal", "urgent", "critical"]),
  notes: z.string().max(500).optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: () => void;
}

export const CreateRequestDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const data = {
      patient_name: String(fd.get("patient_name") || ""),
      blood_group: String(fd.get("blood_group") || ""),
      units_needed: Number(fd.get("units_needed") || 1),
      hospital: String(fd.get("hospital") || ""),
      contact_phone: String(fd.get("contact_phone") || ""),
      urgency: String(fd.get("urgency") || "normal") as "normal" | "urgent" | "critical",
      notes: String(fd.get("notes") || ""),
    };
    const result = schema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("blood_requests").insert({
      ...result.data,
      blood_group: result.data.blood_group as any,
      created_by: user.id,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Request posted! 🙏");
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Post a blood request</DialogTitle>
          <DialogDescription>
            Reach the entire BUBT donor network. Fill in details accurately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient_name">Patient name</Label>
            <Input id="patient_name" name="patient_name" required maxLength={100} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood group</Label>
              <Select name="blood_group" required>
                <SelectTrigger id="blood_group"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="units_needed">Units needed</Label>
              <Input id="units_needed" name="units_needed" type="number" min={1} max={20} defaultValue={1} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital / location</Label>
            <Input id="hospital" name="hospital" required maxLength={150} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact phone</Label>
              <Input id="contact_phone" name="contact_phone" type="tel" required maxLength={20} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select name="urgency" defaultValue="normal">
                <SelectTrigger id="urgency"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {URGENCY.map((u) => <SelectItem key={u} value={u} className="capitalize">{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" maxLength={500} placeholder="Any extra info" rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="hero" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Post request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
