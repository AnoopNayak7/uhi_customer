"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IndianRupee } from "lucide-react";

const MIN_PRICE_OPTIONS = [
  { value: "0", label: "No min" },
  { value: "500000", label: "₹5 Lac" },
  { value: "1000000", label: "₹10 Lac" },
  { value: "2000000", label: "₹20 Lac" },
  { value: "3000000", label: "₹30 Lac" },
  { value: "5000000", label: "₹50 Lac" },
  { value: "10000000", label: "₹1 Cr" },
  { value: "20000000", label: "₹2 Cr" },
  { value: "50000000", label: "₹5 Cr" },
];

const MAX_PRICE_OPTIONS = [
  { value: "0", label: "No max" },
  { value: "1000000", label: "₹10 Lac" },
  { value: "2000000", label: "₹20 Lac" },
  { value: "3000000", label: "₹30 Lac" },
  { value: "5000000", label: "₹50 Lac" },
  { value: "10000000", label: "₹1 Cr" },
  { value: "20000000", label: "₹2 Cr" },
  { value: "30000000", label: "₹3 Cr" },
  { value: "50000000", label: "₹5 Cr" },
  { value: "100000000", label: "₹10 Cr" },
];

interface BudgetRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export function BudgetRangeFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: BudgetRangeFilterProps) {
  const minValue = minPrice?.toString() || "0";
  const maxValue = maxPrice?.toString() || "0";
  const hasBudget = (minPrice && minPrice > 0) || (maxPrice && maxPrice > 0);

  return (
    <div
      className={`budget-range-group shrink-0 ${hasBudget ? "budget-range-group-active" : ""}`}
    >
      <span className="budget-range-prefix" aria-hidden>
        <IndianRupee className="size-3" strokeWidth={1.75} />
      </span>

      <Select
        value={minValue}
        onValueChange={(value) => onMinChange(parseInt(value, 10) || 0)}
      >
        <SelectTrigger className="budget-range-trigger" aria-label="Minimum budget">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent className="filter-select-content" position="popper">
          {MIN_PRICE_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="filter-select-item"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="budget-range-separator" aria-hidden>
        –
      </span>

      <Select
        value={maxValue}
        onValueChange={(value) => onMaxChange(parseInt(value, 10) || 0)}
      >
        <SelectTrigger className="budget-range-trigger" aria-label="Maximum budget">
          <SelectValue placeholder="Max" />
        </SelectTrigger>
        <SelectContent className="filter-select-content" position="popper">
          {MAX_PRICE_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="filter-select-item"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
