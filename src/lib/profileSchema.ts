import { z } from 'zod'

export const Band = z.enum(['High', 'Medium', 'NeedsSupport'])
export type Band = z.infer<typeof Band>

const SubjectRecord = z.object({
  name: z.string().min(1),
  band: Band.nullable(),
  teacher_comment: z.string().max(300).optional(),
})

const AcademicYear = z.object({
  year: z.string().regex(/^\d{4}(-\d{2})?$/, 'year must be YYYY or YYYY-YY'),
  class: z.number().int().min(1).max(12),
  campus: z.string().min(1),
  subjects: z.array(SubjectRecord),
  teacher_tags: z.array(z.string()).default([]),
  student_reflection: z.string().max(500).optional(),
})

const SchoolPosting = z.object({
  campus_name: z.string().min(1),
  city: z.string().min(1),
  class_from: z.number().int().min(1).max(12),
  class_to: z.number().int().min(1).max(12),
  years: z.number().positive(),
})

const CoCurricular = z.object({
  activity: z.string().min(1),
  role: z.string().min(1),
  years_active: z.number().positive(),
})

const AiAnnotations = z.object({
  strengths_summary: z.array(z.string()).min(1).max(3),
  needs_summary: z.array(z.string()).min(1).max(3),
  preferred_learning_modes: z.array(z.string()).min(1).max(2),
  generated_at: z.string().datetime().optional(),
  teacher_approved: z.boolean().default(false),
})

export const StudentProfile = z.object({
  schema_version: z.literal('v0'),
  id: z.string().min(1),
  name: z.string().min(1),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dob must be YYYY-MM-DD').optional(),
  gender: z.enum(['M', 'F', 'Other', 'PreferNotToSay']).optional(),
  org_school_history: z.array(SchoolPosting),
  academic_history: z.array(AcademicYear),
  cocurricular: z.array(CoCurricular).default([]),
  ai_annotations: AiAnnotations.optional(),
  limited_history: z.boolean().default(false),
})

export type StudentProfile = z.infer<typeof StudentProfile>
export type AcademicYear = z.infer<typeof AcademicYear>
export type AiAnnotations = z.infer<typeof AiAnnotations>
