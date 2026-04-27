export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const DEPARTMENTS = [
  "CSE", "EEE", "Civil", "Textile", "Architecture",
  "BBA", "English", "Economics", "Law", "Mathematics", "Other",
] as const;

export const URGENCY = ["normal", "urgent", "critical"] as const;
export type Urgency = (typeof URGENCY)[number];

/** Days since last donation; null if never donated. */
export function daysSince(date: string | null | undefined): number | null {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Donor is eligible if last donation was >= 90 days ago (or never). */
export function isEligible(lastDonation: string | null | undefined): boolean {
  const d = daysSince(lastDonation);
  return d === null || d >= 90;
}
