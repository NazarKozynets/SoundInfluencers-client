import React from "react";
import styles from "./style.module.css";
const FormContainer = ({ children, style }) => {
  return (
    <>
      <div className={styles.form} style={style}>
        {children}
      </div>
    </>
  );
};

export default FormContainer;
