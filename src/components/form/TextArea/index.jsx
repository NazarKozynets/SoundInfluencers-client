import React from "react";
import styles from "./style.module.css";

const TextArea = ({
  value = "",
  setValue,
  title = "",
  placeholder = "",
  error = false,
  style = {},
}) => {
  return (
    <div className={styles.block} style={style}>
      <div className={styles.label}>
        <p className={styles.title}>{title}</p>

        <textarea
          value={value}
          onChange={({ target }) => setValue(target.value)}
          style={{ borderColor: error ? "#FB1E1E" : "transparent" }}
          className={styles.input}
          placeholder={placeholder}
        ></textarea>

        {error ? <p className={styles.error}>!</p> : <></>}
      </div>
    </div>
  );
};

export default TextArea;
