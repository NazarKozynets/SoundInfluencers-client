import React from "react";
import styles from "./style.module.css";
import timeIcon from "../../../images/icons/time.svg";

const InputFile = ({
                     setValue,
                     setUploadProgress, 
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

    const fileInputRef = React.useRef(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={styles.block} style={style}>
            <label className={styles.label}>
                <p className={styles.title}>{title}</p>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    disabled={disabled}
                    accept="image/*"
                    {...args}
                />

                <button
                    type="button"
                    onClick={handleClick}
                    className={
                        className
                            ? `${className} ${styles.inputSilver}`
                            : silverColor
                                ? styles.inputSilver
                                : styles.input
                    }
                    disabled={disabled}
                >
                    Выберите файл
                </button>

                {disabled ? (
                    <div className={styles.disabled}>
                        <img className={styles.disabledIcon} src={timeIcon} alt="Time Icon" />
                        <p className={styles.disabledText}>{disabledTime} hours to unlock</p>
                    </div>
                ) : null}
                {error ? <p className={styles.error}>!</p> : null}
            </label>
        </div>
    );

};

export default InputFile;
