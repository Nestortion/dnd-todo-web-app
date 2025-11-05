import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTheme } from "@/components/theme-provider";
import { Switch } from "./ui/switch";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div>
      <Switch onCheckedChange={(e) => setTheme(e ? "dark" : "light")} />
    </div>
  );
}
