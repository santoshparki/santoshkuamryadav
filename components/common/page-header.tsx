type PageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">{description}</p>
      </div>
      {action}
    </div>
  );
}
