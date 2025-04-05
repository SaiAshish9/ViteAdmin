import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  script: text("script").notNull(),
  objective: text("objective"),
  guidelines: text("guidelines"),
  callFlow: text("call_flow"),
  voiceType: text("voice_type").notNull(),
  maxCallCount: integer("max_call_count").notNull(),
  status: boolean("status").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

export const callHistory = pgTable("call_history", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  status: text("status").notNull(), // "Lead Interested", "Not Interested", "Need to follow up"
  callDate: timestamp("call_date").defaultNow(),
  callSummary: text("call_summary"),
  recordingUrl: text("recording_url"),
  transcriptUrl: text("transcript_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  publishedAt: true,
});

export const insertCallHistorySchema = createInsertSchema(callHistory).omit({
  id: true,
  callDate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertCallHistory = z.infer<typeof insertCallHistorySchema>;
export type CallHistory = typeof callHistory.$inferSelect;
