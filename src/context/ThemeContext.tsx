import { createContext, useContext, useEffect } from "react";

type Theme = "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    };

    return (
        <ThemeContext.Provider value={{ theme: "dark", toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
