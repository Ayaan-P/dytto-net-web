import { z } from 'zod';

export const relationshipSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  bio: z.string().max(500, 'Bio too long').optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone number too long').optional(),
  reminderInterval: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly']),
});

export const interactionSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  tags: z.array(z.string()).max(10, 'Too many tags'),
});

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email'),
});

export function validateRelationship(data: any) {
  return relationshipSchema.safeParse(data);
}

export function validateInteraction(data: any) {
  return interactionSchema.safeParse(data);
}

export function validateUser(data: any) {
  return userSchema.safeParse(data);
}