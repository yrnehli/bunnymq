import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { assert, expr } from "@/lib/utils";

const THEMES = ["dark", "light", "system"] as const;
const themeSchema = z.enum(THEMES).catch("system");
type Theme = z.infer<typeof themeSchema>;

type ThemeProviderProps = {
    children: React.ReactNode;
};

type ThemeProviderState = {
    appearance: Exclude<Theme, "system">;
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    appearance: "light",
    theme: "system",
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps) {
    const storageKey = "theme" as const;
    const [theme, setTheme] = useState<Theme>(() =>
        themeSchema.parse(localStorage.getItem(storageKey)),
    );

    const appearance = expr(() => {
        if (theme === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }

        return theme;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(appearance);
    }, [appearance]);

    const value = {
        appearance,
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    assert(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        context !== undefined,
        "useTheme must be used within a ThemeProvider",
    );

    return context;
};
