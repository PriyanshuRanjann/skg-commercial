export const BRAND_NAME = "Metro Miles";
export const BRAND_TAGLINE = "Every mile, made easy";
export const BRAND_NAME_COMPACT = "MetroMiles";

export const CONTACT_PHONE_DISPLAY = "+91 98765 43210";
export const CONTACT_PHONE_E164 = "+919876543210";
export const WHATSAPP_NUMBER = "919876543210";

export const CONTACT_EMAIL = "info@skgrideservices.com";

export const CONTACT_ADDRESS = "Amorapolis, Bharat Mata Road, Dhanori, Pune MH 411015";

export const SERVICE_TYPES = [
  {
    id: "intra-city",
    label: "Intra-city (On-demand)",
    short: "On-demand",
    description: "Quick rides anywhere within Pune — book in minutes.",
  },
  {
    id: "intercity",
    label: "Intercity (Outstation)",
    short: "Intercity",
    description: "Outstation trips to Mumbai, Lonavala, Nashik, Shirdi & beyond.",
  },
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number]["id"];

export const SERVICE_LOCATIONS = [
  "Dhanori",
  "Viman Nagar",
  "Kharadi",
  "Hinjewadi",
  "Pune Station",
  "Pune Airport",
  "Shivajinagar",
  "Koregaon Park",
  "Hadapsar",
  "Wakad",
  "Baner",
  "Aundh",
  "Pimpri-Chinchwad",
  "Magarpatta",
  "Kalyani Nagar",
] as const;

export const EXPENSE_CATEGORIES = [
  "Fuel",
  "Toll",
  "Maintenance",
  "Parking",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
