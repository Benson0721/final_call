import type { CategoryId } from "./questions";

export function TaiwanMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 220" aria-hidden="true">
      <path d="M71 4c13 12 14 29 9 46-4 14 10 22 15 36 8 22-5 41-13 58-6 13-7 29-17 40-8 9-17 26-27 31-9 4-19-6-15-16 6-16 18-27 19-45 1-13-3-27 3-39 7-14 5-28 8-43 4-20-1-39 3-57 2-8 8-16 15-11Z" fill="currentColor"/>
    </svg>
  );
}

export function CategoryIcon({ category }: { category: CategoryId }) {
  const common = { viewBox: "0 0 64 64", "aria-hidden": true } as const;

  if (category === "alcohol") {
    return <svg {...common}><path d="M25 5h14v11l5 8v31H20V24l5-8V5Zm2 23h10v19H27V28Z" fill="currentColor"/><path d="M25 11h14" stroke="white" strokeWidth="4"/></svg>;
  }
  if (category === "twd") {
    return <svg {...common}><rect x="7" y="15" width="50" height="34" rx="6" fill="currentColor"/><path d="M17 25h30M17 39h30M32 20v24" stroke="white" strokeWidth="4"/><circle cx="32" cy="32" r="7" fill="none" stroke="white" strokeWidth="3"/></svg>;
  }
  if (category === "foreign") {
    return <svg {...common}><circle cx="32" cy="32" r="24" fill="currentColor"/><path d="M8 32h48M32 8c8 7 12 15 12 24S40 49 32 56c-8-7-12-15-12-24S24 15 32 8Z" fill="none" stroke="white" strokeWidth="3"/><path d="M19 20h26M19 44h26" stroke="white" strokeWidth="3"/></svg>;
  }
  if (category === "shopping") {
    return <svg {...common}><path d="M11 22h42l-4 34H15l-4-34Z" fill="currentColor"/><path d="M23 25v-7a9 9 0 0 1 18 0v7" fill="none" stroke="currentColor" strokeWidth="5"/><path d="M22 34h20" stroke="white" strokeWidth="4"/></svg>;
  }
  return <svg {...common}><path d="M32 5 53 13v16c0 14-9 25-21 30C20 54 11 43 11 29V13L32 5Z" fill="currentColor"/><path d="m20 32 8 8 17-19" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function PlaneIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 96 72" aria-hidden="true">
      <path d="M87 30.7 58.8 23 44 3.7c-1.5-2-4.1-3-6.6-2.5l-4.8 1 8.2 17.3-20.2-3.8-9.1-9.4-6 1.3 5.9 13.2L5 31l6.1 1.6 9.6-6.2 20.8 6-9.1 25.3 6.3 1.7 19.9-22.1 28.7 4.9c4 .7 7.7-1.7 8.7-5.6.8-2.6-.8-5.2-3.5-5.9Z" fill="currentColor"/>
    </svg>
  );
}
