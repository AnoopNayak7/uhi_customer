"use client";

import * as React from "react";
import RcSlider from "rc-slider";
import "rc-slider/assets/index.css";
import { cn } from "@/lib/utils";

interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

const Slider = React.forwardRef<any, SliderProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      () => value?.[0] ?? defaultValue?.[0] ?? min
    );

    // Sync with external value changes (but avoid render loops)
    React.useEffect(() => {
      if (value?.[0] !== undefined && value[0] !== internalValue) {
        setInternalValue(value[0]);
      }
    }, [value, internalValue]);

    // Debounce for parent callback during dragging
    const debouncedCallback = React.useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (val: number) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onValueChange?.([val]);
        }, 100); // 100ms debounce for parent updates
      };
    }, [onValueChange]);

    const handleChange = (newValue: number | number[]) => {
      const val = Array.isArray(newValue) ? newValue[0] : newValue;

      // Update internal state immediately for smooth UI
      setInternalValue(val);

      // Debounced callback to parent to reduce excessive updates
      debouncedCallback(val);
    };

    const handleAfterChange = (newValue: number | number[]) => {
      const val = Array.isArray(newValue) ? newValue[0] : newValue;
      console.log("RC-Slider final value:", val);
      // Ensure final value is set immediately when dragging stops
      onValueChange?.([val]);
    };

    return (
      <div className={cn("w-full py-2", className)}>
        {/* RC Slider with optimized styling */}
        <div style={{ padding: "0 8px" }}>
          <RcSlider
            ref={ref}
            value={internalValue}
            onChange={handleChange}
            onAfterChange={handleAfterChange}
            min={min}
            max={max}
            step={1}
            disabled={disabled}
            trackStyle={{
              backgroundColor: "hsl(var(--primary))",
              height: 6,
              borderRadius: 3,
            }}
            railStyle={{
              backgroundColor: "hsl(var(--secondary))",
              height: 6,
              borderRadius: 3,
            }}
            handleStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--primary))",
              borderWidth: 2,
              width: 18,
              height: 18,
              marginTop: -6,
              opacity: 1,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              cursor: "grab",
            }}
            activeDotStyle={{
              borderColor: "hsl(var(--primary))",
              backgroundColor: "hsl(var(--background))",
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
