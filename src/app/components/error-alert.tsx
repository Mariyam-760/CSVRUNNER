import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  errors: string[];
  title?: string;
}

export function ErrorAlert({ errors, title = 'Validation Errors' }: ErrorAlertProps) {
  if (errors.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">
              {error}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}