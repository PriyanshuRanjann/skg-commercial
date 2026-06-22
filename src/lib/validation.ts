import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  password: z.string().min(1).max(256),
});

export const shiftStartSchema = z.object({
  photo1_b64: z.string().min(1),
  photo2_b64: z.string().min(1),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  km: z.number().int().min(0).max(10_000_000),
});

export const shiftEndSchema = z.object({
  shift_id: z.string().min(1),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  km: z.number().int().min(0).max(10_000_000),
});

export const rideSchema = z.object({
  shift_id: z.string().min(1),
  fare: z.number().min(0).max(1_000_000),
});

export const expenseSchema = z.object({
  shift_id: z.string().min(0).optional(),
  type: z.enum(["Fuel", "Toll", "Maintenance", "Parking", "Other"]),
  amount: z.number().min(0).max(1_000_000),
  photo_b64: z.string().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  note: z.string().max(500).optional(),
});

export const feedbackSchema = z.object({
  name: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const driverSignupSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  password: z.string().min(6).max(256),
});

export const ownerSignupSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  password: z.string().min(8).max(256),
});

export const driverUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(120),
  phone: z.string().max(40).optional().default(""),
  username: z.string().min(1).max(64).trim(),
  password: z.string().min(4).max(256).optional(),
  commission_pct: z.number().min(0).max(100),
  active: z.boolean().optional().default(true),
});
