import { dealCategories, type DealCategoryId } from "@/lib/deal-categories";

export function DealStickerGrid({ value, onChange }: { value: DealCategoryId; onChange: (id: DealCategoryId) => void }) {
  return <div className="grid grid-cols-3 gap-1" role="group" aria-label="Filter deals by food type">
    {dealCategories.map(c => {
      const selected = value === c.id && c.id !== "all";
      return <button key={c.id} type="button" onClick={() => onChange(c.id)} aria-pressed={value === c.id} className={`deal-sticker flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-xs font-bold ${selected ? "deal-sticker--active" : ""}`}>
        <img src={c.image} alt={c.alt} width={1024} height={1024} loading="lazy" className="h-20 w-20 object-contain" />
        <span className={`text-center leading-tight ${value === c.id ? "underline decoration-2 underline-offset-2" : ""}`}>{c.label}</span>
      </button>;
    })}
  </div>;
}
