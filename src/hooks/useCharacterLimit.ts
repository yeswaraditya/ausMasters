import { useState, useCallback } from "react";

interface UseCharacterLimitOptions {
  max: number;
  warningThreshold?: number;
  initial?: string;
}

interface UseCharacterLimitReturn {
  value: string;
  characterCount: number;
  max: number;
  percentage: number;
  isAtLimit: boolean;
  isWarning: boolean;
  color: "safe" | "warning" | "danger";
  setValue: (value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function useCharacterLimit({
  max,
  warningThreshold = 0.9,
  initial = "",
}: UseCharacterLimitOptions): UseCharacterLimitReturn {
  const [value, setValue] = useState(initial);

  const characterCount = value.length;
  const percentage = (characterCount / max) * 100;
  const isAtLimit = characterCount >= max;
  const isWarning = characterCount / max >= warningThreshold;

  const color = isAtLimit ? "danger" : isWarning ? "warning" : "safe";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value.slice(0, max));
    },
    [max]
  );

  return {
    value,
    characterCount,
    max,
    percentage,
    isAtLimit,
    isWarning,
    color,
    setValue,
    handleChange,
  };
}
