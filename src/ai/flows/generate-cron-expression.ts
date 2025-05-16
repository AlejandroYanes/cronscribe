// use server'

/**
 * @fileOverview A CRON expression generation AI agent.
 *
 * - generateCronExpression - A function that generates a CRON expression from a natural language description.
 * - GenerateCronExpressionInput - The input type for the generateCronExpression function.
 * - GenerateCronExpressionOutput - The return type for the generateCronExpression function.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCronExpressionInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A natural language description of the desired CRON schedule.'
    ),
});

export type GenerateCronExpressionInput = z.infer<
  typeof GenerateCronExpressionInputSchema
>;

const GenerateCronExpressionOutputSchema = z.object({
 cronExpression: z
 .string()
 .describe('The generated CRON expression that matches the description, or an empty string if no valid schedule was detected.'),
  isValidSchedule: z.boolean().describe('True if the input description corresponds to a valid schedule, false otherwise.'),
});

export type GenerateCronExpressionOutput = z.infer<
  typeof GenerateCronExpressionOutputSchema
>;

export async function generateCronExpression(
  input: GenerateCronExpressionInput
): Promise<GenerateCronExpressionOutput> {
  return generateCronExpressionFlow(input);
}

const generateCronExpressionPrompt = ai.definePrompt({
  name: 'generateCronExpressionPrompt',
  input: {schema: GenerateCronExpressionInputSchema},
  output: {schema: GenerateCronExpressionOutputSchema},
  prompt: `You are a CRON expression expert. You will generate a CRON expression based on the user's natural language description.
  If the description provided does not represent a valid schedule, indicate that by setting the isValidSchedule field to false and the cronExpression to an empty string.
  If the description is valid, set isValidSchedule to true and generate the corresponding CRON expression.

  Description: {{{description}}}

  Ensure the CRON expression adheres to standard CRON syntax (5 or 6 fields).\n  `,
});

const generateCronExpressionFlow = ai.defineFlow(
  {
    name: 'generateCronExpressionFlow',
    inputSchema: GenerateCronExpressionInputSchema,
    outputSchema: GenerateCronExpressionOutputSchema,
  },
  async (input) => {
    const { output } = await generateCronExpressionPrompt(input);
    return output!;
  }
);
