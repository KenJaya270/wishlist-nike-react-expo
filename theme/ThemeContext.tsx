import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = "light" | "dark";

interface ThemeContextType {
    theme: ThemeType;
    toggleTheme: () => void;
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const systemColorScheme = useColorScheme();

    const [theme, setTheme] = useState<ThemeType>("light");

    useEffect(() => {

        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('appTheme');

            if(savedTheme === "light" || savedTheme === "dark") {
                setTheme(savedTheme);
            }else {
                setTheme(systemColorScheme === "dark" ? "dark" : "light");
            }
        }

        loadTheme();
    }, [systemColorScheme]);

    const toggleTheme = () => {

        const newTheme = theme === "dark" ? "light" : "dark";

        setTheme(newTheme);

        AsyncStorage.setItem('appTheme', newTheme);
    }

    const isDarkMode = theme === "dark";

    return (

        <ThemeContext.Provider value={{theme, toggleTheme, isDarkMode}}>
            {children}
        </ThemeContext.Provider>

    )
}

export const useTheme = () => {

    const context = useContext(ThemeContext);

    if(!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;

}