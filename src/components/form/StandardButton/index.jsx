import React from "react";
import styles from "./style.module.css";

const StandardButton = ({ onClick, text = "", style = {}, isBlue = false }) => {
  const buttonClass = isBlue ? styles.buttonBlue : styles.button;

  return (
      <button
          type="button"
          style={style}
          className={buttonClass}
          onClick={onClick}
      >
        {text}
      </button>
  );
};

export default StandardButton;
