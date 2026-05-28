"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, Paintbrush } from "lucide-react";
import { useTheme } from "./theme-provider";

type ThemeValue = "ocean" | "forest" | "rose" | "amber" | "violet" | "default";

type ThemeOption = {
  value: ThemeValue;
  label: string;
};

const themeOptions: ThemeOption[] = [
  {
    value: "default",
    label: "Default",
  },
  {
    value: "ocean",
    label: "Ocean",
  },
  {
    value: "forest",
    label: "Forest",
  },
  {
    value: "rose",
    label: "Rose",
  },
  {
    value: "amber",
    label: "Amber",
  },
  {
    value: "violet",
    label: "Violet",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const currentTheme = themeOptions.find((option) => option.value === theme);

  const handleThemeChange = (value: ThemeValue) => {
    setTheme(value as any);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "relative",
            "h-9",
            "w-9",
            "p-0",
            "rounded-full",
            "border-sidebar-border"
          )}
        >
          <Paintbrush className="h-4 w-4" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 space-y-1">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Theme
        </div>
        {themeOptions.map((option) => {
          const isSelected = theme === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={cn(
                "flex items-center justify-between gap-3 cursor-pointer relative",
                {
                  "bg-accent text-accent-foreground": isSelected,
                }
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border border-border"
                  style={{
                    backgroundColor: `oklch(${
                      option.value === "default"
                        ? "0.7 0 0"
                        : option.value === "ocean"
                        ? "0.6 0.16 240"
                        : option.value === "forest"
                        ? "0.55 0.15 140"
                        : option.value === "rose"
                        ? "0.6 0.18 0"
                        : option.value === "amber"
                        ? "0.7 0.18 80"
                        : "0.6 0.18 280"
                    })`,
                  }}
                />
                <span className="text-sm">{option.label}</span>
              </div>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ThemeSwitcher.displayName = "ThemeSwitcher";
