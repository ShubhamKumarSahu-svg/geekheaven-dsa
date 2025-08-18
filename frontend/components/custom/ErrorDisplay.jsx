import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ErrorDisplay = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-6">
    <Card className="w-full max-w-lg bg-destructive border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive-foreground">
          Oops! Something went wrong.
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg bg-destructive/80 p-3 rounded-md text-destructive-foreground">
          {message}
        </p>
        <p className="mt-6 text-md text-muted-foreground">
          Please ensure your backend server is running.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default ErrorDisplay;
