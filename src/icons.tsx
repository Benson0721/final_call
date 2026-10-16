import type { CategoryId } from "./questions";

export function TaiwanMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 126 236" aria-hidden="true">
      {/* Taiwan main-island outline, derived from Natural Earth 1:50m public-domain data. */}
      <path d="M63.5 176.1L59.8 183L56.9 190.4L55.7 197.3L55.8 204.5L54.9 210.9L53.5 217.3L47.7 215.5L44.6 210.9L43.9 203.4L39.7 194.3L38.1 191.7L32.1 186.7L26.7 184.1L22.4 180.4L23 180.7L19.9 175.7L17.5 170.3L12.6 155.1L10.9 151.4L8.6 148.1L8 144.7L8.8 141L10.9 135.5L12.2 130L11.1 122.4L11.5 114.9L13.1 111.6L41 66L48.6 56.3L53.2 51.5L57.1 46.2L60.8 39.4L65.4 33.2L68.6 31.3L84.6 25.7L89.6 20.4L93.6 18.7L98.1 18.8L101.1 21.3L103.7 24.3L106.4 26L113.5 28.9L116.6 31.8L118 36.7L113.7 41.3L111.5 45.5L111.1 50.1L111.9 56.4L112 62.7L106.6 77.5L100.8 86.6L99.3 91.2L97.5 102.6L94.1 114L91.2 128.5L86.5 143.4L83.8 149.6L80.5 155.6L72.5 166.9Z" fill="currentColor"/>
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
