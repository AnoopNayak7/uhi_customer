import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldErrorProps {
  /** Must match the input's aria-describedby so screen readers announce it. */
  id: string;
  message?: string;
  className?: string;
}

/**
 * Accessible inline form error. Renders nothing when there is no message.
 * Pairs an icon with the text (not colour alone) and exposes an id + role
 * so it can be wired to an input via aria-describedby / aria-invalid.
 */
export function FieldError({ id, message, className }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "flex items-center gap-1.5 text-xs text-destructive",
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
