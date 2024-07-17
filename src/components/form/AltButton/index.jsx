import React from "react";
import styles from "./style.module.css";

const AltButton = ({ onClick, text = "", style }) => {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      style={style}
    >
      {text}
    </button>
  );
};

export default AltButton;
