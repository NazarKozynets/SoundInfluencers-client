import React from "react";
import styles from "./style.module.css";

const StandardButton = ({ onClick, text = "", style = {}, isBlue = false, isDisabled = false, isRed=false}) => {
  const buttonClass = isBlue ? styles.buttonBlue : isRed ? styles.buttonRed : styles.button;

  return (
      <button
          type="button"
          style={style}
          className={buttonClass}
          onClick={onClick}
          disabled={isDisabled}
      >
        {text}
      </button>
  );
};

export default StandardButton;
