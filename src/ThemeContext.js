// ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { lightTheme, darkTheme } from "./themes";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    document
      .querySelector("body")
      .setAttribute("data-theme", theme === "light" ? "dark" : "light");
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };

  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    const getTheme = localStorage.getItem("theme");
    if (!getTheme) return;
    if (getTheme !== "light" && getTheme !== "dark") return;
    setTheme(getTheme);
    document.querySelector("body").setAttribute("data-theme", getTheme);
  });

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
