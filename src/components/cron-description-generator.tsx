"use client";

import { useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Trash2, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { describeCronExpressionAction } from '@/app/actions';

export function CronDescriptionGenerator() {
  const [cronExpression, setCronExpression] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setDescription('');

    if (!cronExpression.trim()) {
      setError('Please enter a CRON expression.');
      return;
    }

    // Basic validation for CRON expression format (5 or 6 fields)
    const cronParts = cronExpression.trim().split(/\s+/);
    if (cronParts.length < 5 || cronParts.length > 6) {
      setError('Please enter a valid CRON expression (5 or 6 parts).');
      return;
    }


    startTransition(async () => {
      try {
        // Pass the cronExpression within an object matching the expected schema
        const result = await describeCronExpressionAction({ cronExpression });

        if (result.description) {
          setDescription(result.description);
        } else if (result.error) {
          setError(result.error);
        }


      } catch (e) {
        setError('Failed to generate description. Please try again later.');
        console.error("Error during description generation:", e);
      }
    });
  };

  const handleClear = () => {
    setCronExpression('');
    setDescription('');
    setError(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center text-foreground">
          <Sparkles className="mr-2 h-7 w-7 text-primary" />
          Describe CRON Expression
        </CardTitle>
        <CardDescription>
          Enter a CRON expression to get a natural language description.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="cron-expression" className="text-lg font-medium text-foreground">CRON Expression</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="cron-expression"
                placeholder="* * * * *"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                className="font-mono text-base flex-grow focus:ring-primary focus:border-primary disabled:opacity-70"
                aria-label="CRON Expression input"
                disabled={isPending}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg font-medium text-foreground">Natural Language Description</Label>
            <div className="flex items-center space-x-2">
               <Textarea
                  id="description"
                  readOnly
                  value={description}
                  placeholder="e.g., 'Every minute'"
                  rows={4}
                  className="text-base flex-grow bg-secondary/50 border-border disabled:opacity-70"
                  aria-label="Natural language description output"
                  disabled={isPending}
                />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t mt-4">
           <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={isPending}
            className="w-full sm:w-auto border-muted-foreground/50 hover:bg-muted/50 disabled:opacity-70"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
          <Button
            type="submit"
            disabled={isPending || !cronExpression.trim()}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-70"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Describe
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}