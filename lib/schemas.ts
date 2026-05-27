import { z } from "zod";

// 1. Waitlist Submission Schema
export const WaitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  experience: z.enum(["beginner", "intermediate", "advanced", "institutional"], {
    message: "Please select your experience level.",
  }),
  challenge: z.string().min(3, "Please detail your biggest decision challenge (min 3 characters)."),
  tools: z.string().min(1, "Please tell us what tools you currently use."),
  expectation: z.string().min(3, "Please let us know what would make TradeX valuable (min 3 characters)."),
  referredBy: z.string().optional().nullable(),
  joinNewsletter: z.boolean(),
});

export type WaitlistInput = z.infer<typeof WaitlistSchema>;

// 2. Feedback Schema (Drawer)
export const FeedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address."),
  type: z.enum(["Idea", "Pain", "Question", "Feature"], {
    message: "Please select feedback category.",
  }),
  message: z.string().min(5, "Please elaborate your suggestion (min 5 characters)."),
});

export type FeedbackInput = z.infer<typeof FeedbackSchema>;

// 3. Terminal Query Schema
export const TerminalSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(3, "Message must be at least 3 characters."),
});

export type TerminalInput = z.infer<typeof TerminalSchema>;
