// use server'

/**
 * @fileOverview AI agents for CRON expression generation and description.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schemas for Cron Description Flow
const DescribeCronExpressionInputSchema = z.object({
  cronExpression: z
    .string()
    .describe('A CRON expression string.'),
});

export type DescribeCronExpressionInput = z.infer<
  typeof DescribeCronExpressionInputSchema
>;

const DescribeCronExpressionOutputSchema = z.object({
  description: z
    .string()
    .describe('A natural language description of the CRON schedule.'),
  isValidCron: z
    .boolean()
    .describe('True if the input is a syntactically valid CRON expression, false otherwise.'),
});

export type DescribeCronExpressionOutput = z.infer<
  typeof DescribeCronExpressionOutputSchema
>;

// Cron Description Flow
export async function describeCronExpression(
  input: DescribeCronExpressionInput
): Promise<DescribeCronExpressionOutput> {
  return describeCronExpressionFlow(input);
}

const describeCronExpressionPrompt = ai.definePrompt({
  name: 'describeCronExpressionPrompt',
  input: { schema: DescribeCronExpressionInputSchema },
  output: { schema: DescribeCronExpressionOutputSchema },
  prompt: `You are a CRON expression expert. Your task is to provide a clear, concise natural language description for the given CRON expression.
  If the input is not a syntactically valid CRON expression (must have 5 or 6 fields), set isValidCron to false and the description to an empty string.
  If the input is valid, set isValidCron to true and provide the description.

  CRON Expression: {{{cronExpression}}}

  Provide only the natural language description in the 'description' field.
  `,
});

const describeCronExpressionFlow = ai.defineFlow(
  {
    name: 'describeCronExpressionFlow',
    inputSchema: DescribeCronExpressionInputSchema,
    outputSchema: DescribeCronExpressionOutputSchema,
  },
  async input => {
    const { output } = await describeCronExpressionPrompt(input);
    return output!;
  }
);