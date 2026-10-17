type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  );
}
