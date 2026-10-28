"use client";

import { Minus, Plus } from "lucide-react";

// Cùng giới hạn với MAX_QUANTITY trong auth.js của backend.
export const MAX_QUANTITY = 99;

const stepButton =
  "flex h-full w-9 items-center justify-center text-foreground hover:bg-surface disabled:opacity-40 disabled:hover:bg-transparent";

// Bộ tăng giảm "− 2 +". Dùng ở trang chi tiết và trên mỗi dòng giỏ hàng.
export default function QuantityInput({
  value,
  onChange,
  disabled = false,
  label = "Số lượng",
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex h-11 w-fit items-center border border-border">
      <button
        type="button"
        aria-label="Giảm số lượng"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        className={stepButton}
      >
        <Minus size={16} />
      </button>
      <span aria-live="polite" className="w-10 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Tăng số lượng"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= MAX_QUANTITY}
        className={stepButton}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
