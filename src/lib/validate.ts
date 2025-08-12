import { z } from "zod";

export const AnalyzeSchema = z.object({
  jobText: z.string().min(10),
});

export const RewriteSchema = z.object({
  resumeText: z.string().min(10),
  jobText: z.string().min(10),
  role: z.string().optional(),
});

export const CoverLetterSchema = z.object({
  resumeText: z.string().optional(),
  jobText: z.string().min(10),
  company: z.string().min(1),
  role: z.string().min(1),
});
