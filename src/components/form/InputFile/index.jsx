import React from "react";
import styles from "./style.module.css";
import timeIcon from "../../../images/icons/time.svg";

const InputFile = ({
                     setValue,
                     setUploadProgress, // Пропс для обновления прогресса
                     title = "",
                     error = false,
                     style = {},
                     disabled = false,
                     disabledTime = "24",
                     silverColor = false,
                     className,
                     ...args
                   }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setValue(file);
      setUploadProgress(100); 
    } else {
      console.log("Selected file is not an image");
      setUploadProgress(0); 
    }
  };

  return (
      <div className={styles.block} style={style}>
        <label className={styles.label}>
          <p className={styles.title}>{title}</p>

          <input
              type={disabled ? "text" : "file"}
              style={{
                borderColor: error ? "#FB1E1E" : "transparent",
                height: "50px",
              }}
              className={
                className
                    ? `${className} ${styles.inputSilver}`
                    : silverColor
                        ? styles.inputSilver
                        : styles.input
              }
              onChange={handleFileChange}
              disabled={disabled}
              accept="image/*" 
              {...args}
              placeholder={disabled ? "" : args.placeholder}
          />

          {disabled ? (
              <div className={styles.disabled}>
                <img
                    className={styles.disabledIcon}
                    src={timeIcon}
                    alt="Time Icon"
                />
                <p className={styles.disabledText}>
                  {disabledTime} hours to unlock
                </p>
              </div>
          ) : null}
          {error ? <p className={styles.error}>!</p> : null}
        </label>
      </div>
  );
};

export default InputFile;
