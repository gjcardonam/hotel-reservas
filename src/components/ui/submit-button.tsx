"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export function SubmitButton({
  children,
  confirm,
  pendingText,
  ...props
}: ButtonProps & { confirm?: string; pendingText?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingText ?? "Procesando…"}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
