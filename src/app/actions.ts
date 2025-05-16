'use server';

import { generateCronExpression, type GenerateCronExpressionInput, type GenerateCronExpressionOutput } from '@/ai/flows/generate-cron-expression';
import { headers } from 'next/headers';
import { describeCronExpression } from '@/ai/flows/describe-cron-expression';
import { rateLimiter } from '@/lib/rate-limiter';
import { z } from 'zod';

const ActionInputSchema = z.object({
  description: z.string().min(1, "Description cannot be empty.").max(250, "Description is too long."),
});

interface ActionResult {
  cronExpression?: string;
  description?: string;
  error?: string;
}

export async function generateCronExpressionAction(input: GenerateCronExpressionInput): Promise<ActionResult> {
  const __headers = await headers();
  const ip = __headers.get('x-forwarded-for') || 'api';
  try {
    // Apply rate limiting based on IP address
    // const ip = '127.0.0.1'; // Placeholder - Replace with actual IP retrieval logic
    const rateLimitResult = await rateLimiter.limit(ip);

    if (!rateLimitResult.success) {
      return { error: 'Too many requests. Please try again later.' };
    }

    const validatedInput = ActionInputSchema.safeParse(input);
    if (!validatedInput.success) {
      return { error: validatedInput.error.errors.map(e => e.message).join(', ') };
    }

    // Call the AI flow
    const result: GenerateCronExpressionOutput = await generateCronExpression(validatedInput.data);
    
    if (!result.isValidSchedule) {
 return { error: 'Could not generate a CRON expression from the provided text. Please describe a valid schedule.' };
    }

    if (result.cronExpression) { // This check might be redundant if isValidSchedule is false when cronExpression is empty
      // Basic validation for CRON expression format (5 or 6 fields)
      const cronParts = result.cronExpression.trim().split(/\s+/);
      if (cronParts.length < 5 || cronParts.length > 6) {
        console.warn("AI generated an invalid CRON format:", result.cronExpression);
        return { error: 'The AI generated an invalid CRON format. Please try rephrasing your request.' };
      }
      return { cronExpression: result.cronExpression };
    } else {
      // This case might happen if isValidSchedule is true but the AI still didn't generate an expression
      return { error: 'The AI did not return a CRON expression. Please try again.' };
    }

  } catch (e: any) {
    console.error("Error in generateCronExpressionAction:", e);
    // Log the actual error for server-side debugging
    // For the client, return a generic message
    let errorMessage = 'An error occurred while generating the CRON expression.';
    if (e.message && typeof e.message === 'string' && e.message.includes('Deadline exceeded')) {
        errorMessage = 'The request timed out. Please try again.';
    } else if (e.message && typeof e.message === 'string' && e.message.toLowerCase().includes('quota')) {
        errorMessage = 'The service is currently experiencing high load or has reached its quota. Please try again later.';
    }
    
    return { error: errorMessage };
  }
}

const DescribeActionInputSchema = z.object({
  cronExpression: z.string().min(1, "CRON expression cannot be empty."),
});

export async function describeCronExpressionAction(input: z.infer<typeof DescribeActionInputSchema>): Promise<ActionResult> {
  const __headers = await headers();
  const ip = __headers.get('x-forwarded-for') || 'api';
  try {
    // Apply rate limiting based on IP address
    const ip = '127.0.0.1'; // Placeholder - Replace with actual IP retrieval logic
    const rateLimitResult = await rateLimiter.limit(ip);

    if (!rateLimitResult.success) {
      return { error: 'Too many requests. Please try again later.' };
    }

    const validatedInput = DescribeActionInputSchema.safeParse(input);
    if (!validatedInput.success) {
      return { error: validatedInput.error.errors.map(e => e.message).join(', ') };
    }

    const description = await describeCronExpression({ cronExpression: validatedInput.data.cronExpression});
    return description;
    
  } catch (e: any) {
    console.log("Error in describeCronExpressionAction:", e);
    let errorMessage = 'An error occurred while describing the CRON expression.';
    if (e.message && typeof e.message === 'string' && e.message.includes('Deadline exceeded')) {
        errorMessage = 'The request timed out. Please try again.';
    } else if (e.message && typeof e.message === 'string' && e.message.toLowerCase().includes('quota')) {
        errorMessage = 'The service is currently experiencing high load or has reached its quota. Please try again later.';
    }
    return { error: errorMessage };
  }
}
