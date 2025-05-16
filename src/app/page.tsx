import { CronGenerator } from '@/components/cron-generator';
import { CronDescriptionGenerator } from '@/components/cron-description-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Terminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">
          Cronscribe
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          AI-Powered CRON Expression Generator
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-12">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="generate">Generate CRON</TabsTrigger>
            <TabsTrigger value="describe">Describe CRON</TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="w-full">
            <CronGenerator />
          </TabsContent>
          <TabsContent value="describe" className="w-full">
            <CronDescriptionGenerator />
          </TabsContent>
        </Tabs>
        
        {/* Remaining content stays below the tabs */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <ListChecks className="mr-3 h-6 w-6 text-accent" />
              How to Use Cronscribe
            </CardTitle>
            <CardDescription>Follow these simple steps to generate your CRON expressions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Simply type a human-readable description of when you want your task to run into the input field above. Our AI will then translate your description into a CRON expression.
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>
                <strong>Enter Description:</strong> Type in phrases like:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>"Run every 5 minutes"</li>
                  <li>"Execute daily at 3 AM"</li>
                  <li>"Perform on the 1st and 15th of each month at midnight"</li>
                  <li>"Schedule for every weekday (Monday to Friday) at 10:30 PM"</li>
                </ul>
              </li>
              <li>
                <strong>Generate:</strong> Click the "Generate" button.
              </li>
              <li>
                <strong>Copy:</strong> The generated CRON expression will appear. Click the copy icon to copy it to your clipboard.
              </li>
            </ol>
             <p className="pt-2">
              <strong>Example:</strong> If you type "every Monday at 8:00 AM", Cronscribe should generate: <code className="font-mono bg-secondary px-1.5 py-0.5 rounded-md text-sm text-secondary-foreground">0 8 * * 1</code>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <Terminal className="mr-3 h-6 w-6 text-accent" />
              Understanding CRON Expressions
            </CardTitle>
            <CardDescription>A quick guide to the structure of CRON expressions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              A CRON expression is a string of five (or sometimes six for seconds precision) fields separated by spaces, representing a schedule.
            </p>
            <div className="overflow-x-auto">
              <pre className="p-4 bg-secondary rounded-md font-mono text-sm text-secondary-foreground">
                <code>
{`┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
│ │ │ │ │                                   7 is also Sunday on some systems)
│ │ │ │ │
* * * * *  command to execute`}
                </code>
              </pre>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li><code className="font-mono bg-secondary px-1 py-0.5 rounded-md text-xs text-secondary-foreground">*</code> any value</li>
              <li><code className="font-mono bg-secondary px-1 py-0.5 rounded-md text-xs text-secondary-foreground">,</code> value list separator</li>
              <li><code className="font-mono bg-secondary px-1 py-0.5 rounded-md text-xs text-secondary-foreground">-</code> range of values</li>
              <li><code className="font-mono bg-secondary px-1 py-0.5 rounded-md text-xs text-secondary-foreground">/</code> step values</li>
            </ul>
          </CardContent>
        </Card>
      </main>
       <footer className="mt-12 mb-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Cronscribe. All rights reserved.</p>
      </footer>
    </div>
  );
}
