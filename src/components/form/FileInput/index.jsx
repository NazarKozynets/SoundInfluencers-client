import React from "react";
import styles from "./style.module.css";
import timeIcon from "../../../images/icons/time.svg";

const FileInput = ({
  value = "",
  setValue,
  title = "",
  placeholder = "",
  error = false,
  style = {},
  type = "text",
  disabled = false,
  disabledTime = "3",
  ...args
}) => {
  return (
    <div className={styles.block} style={style}>
      <label className={styles.label}>
        <p className={styles.title}>{title}</p>
        <input
          type={type}
          style={{ borderColor: error ? "#FB1E1E" : "transparent" }}
          className={styles.input}
          placeholder={disabled ? "" : placeholder}
          value={value}
          onChange={({ target }) => setValue(target.value)}
          disabled={disabled}
          {...args}
        />
        {disabled ? (
          <div className={styles.disabled}>
            <img className={styles.disabledIcon} src={timeIcon} />
            <p className={styles.disabledText}>{disabledTime} days to unlock</p>
          </div>
        ) : (
          <></>
        )}
        {error ? <p className={styles.error}>!</p> : <></>}
      </label>
    </div>
  );
};

export default FileInput;
