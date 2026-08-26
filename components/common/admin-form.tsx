"use client";

import { useForm, type DefaultValues, type FieldValues, type Resolver, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

export function AdminForm<TValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: {
  schema: z.ZodType<TValues, TValues>;
  defaultValues: DefaultValues<TValues>;
  onSubmit: (values: TValues) => Promise<void> | void;
  children: (methods: UseFormReturn<TValues>) => React.ReactNode;
}) {
  const methods = useForm<TValues>({
    resolver: zodResolver(schema) as Resolver<TValues>,
    defaultValues,
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
      {children(methods)}
    </form>
  );
}
