import { Link } from 'react-router-dom';

export function EmptyState({ title, hint, actionLabel, actionTo }: { title: string; hint?: string; actionLabel?: string; actionTo?: string }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center" role="status">
      <p className="text-lg font-semibold">{title}</p>
      {hint && <p className="mt-2 text-sm opacity-70 max-w-md">{hint}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-4 px-5 py-2 bg-[var(--brand-red,#C00000)] text-white rounded-lg">{actionLabel}</Link>
      )}
    </div>
  );
}
