import React from "react";
import styles from "./style.module.css";
import timeIcon from "../../../images/icons/time.svg";

const InputFile = ({
  setValue,
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
    // Get the first file from the file list, if it exists
    const file = event.target.files[0];

    // Check if the file is an image
    if (file && file.type.startsWith("image/")) {
      setValue(file);
    } else {
      // Handle the case when the file is not an image
      console.log("Selected file is not an image");
      // Optionally, reset the input or provide feedback to the user
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
          accept="image/*" // Accept only image files
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
