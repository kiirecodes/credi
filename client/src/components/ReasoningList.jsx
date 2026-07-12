import { ChevronRight } from 'lucide-react';

export default function ReasoningList({ reasoning }) {
  if (!reasoning || reasoning.length === 0) return null;

  return (
    <ul className="space-y-2">
      {reasoning.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-slate-750">
          <ChevronRight className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  );
}
