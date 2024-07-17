import React from "react";
import styles from "./style.module.css";
import { useTheme } from "../../ThemeContext";

const Background = () => {
  const { theme } = useTheme();
  return (
    <div className={styles.background} style={{ background: theme.background }}>
      <div
        className={styles.decor}
        style={{ position: "absolute", top: "0", left: "0" }}
      ></div>
      <div
        className={styles.decor}
        style={{ position: "absolute", bottom: "0", right: "0" }}
      ></div>
    </div>
  );
};

export default Background;
