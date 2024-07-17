import React from "react";
import styles from "./style.module.css";

const ResponseButton = ({ onClickYes, onClickNo, style = {} }) => {
  return (
    <div className={styles.block} style={style}>
      <button className={styles.buttonTrue} onClick={onClickYes}>
        YES
      </button>
      <button className={styles.buttonFalse} onClick={onClickNo}>
        NO
      </button>
    </div>
  );
};

export default ResponseButton;
