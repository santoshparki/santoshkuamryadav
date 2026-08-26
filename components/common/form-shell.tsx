"use client";

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type FormShellProps<TSchema extends z.ZodTypeAny> = {
  schema: TSchema;
  defaultValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  children: (methods: ReturnType<typeof useForm>) => React.ReactNode;
};

export function FormShell<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: FormShellProps<TSchema>) {
  const methods = useForm({
    resolver: zodResolver(schema as never),
    defaultValues,
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit as never)} className="space-y-6">
      {children(methods)}
    </form>
  );
}
