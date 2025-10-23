import { useTheme } from "../theme-provider";
import { Toggle } from "@/components/ui/toggle";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const handleToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    setIsDark(!isDark);
  };

  return (
    <Toggle
      aria-label="Toggle theme"
      pressed={isDark}
      onPressedChange={handleToggle}
      className="rounded-full p-2 bg-muted hover:bg-accent transition-colors dark:bg-card"
    >
      {isDark ? (
        <Moon className="h-5 w-5  " />
      ) : (
        <Sun className="h-5 w-5 " />
      )}
    </Toggle>
  );
}
