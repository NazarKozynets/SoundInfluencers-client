import React from "react";
import styles from "./style.module.css";
import { useTheme } from "../../ThemeContext";

const TitleSection = ({ title = "", span = "" }) => {
  return (
    <h1 className={styles.title}>
      {title} <span className={styles.span}>{span}</span>
    </h1>
  );
};

export default TitleSection;
