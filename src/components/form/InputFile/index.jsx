import React, { useEffect, useRef } from "react";
import styles from "./styles.module.css";

const InputFile = ({
                       setValue,
                       value,
                       setUploadProgress,
                       title = "",
                       error = false,
                       style = {},
                       silverColor = false,
                       className,
                       placeholder,
                       ...args
                   }) => {
    const fileInputRef = useRef(null);

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

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        if (!value && fileInputRef.current) {
            fileInputRef.current.value = null; 
        }
    }, [value]);

    return (
        <div className={styles.block} style={style}>
            <p className={styles.title}>{title}</p>
            <div className={styles.fileUploadBlock}>
                <input
                    className={styles.input}
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    placeholder={placeholder}
                    {...args}
                />

                <button className={styles.uploadButton} onClick={handleClick}>
                    Upload
                </button>

                <p className={styles.placeholderAfterButton}>
                    {value ? value.name : placeholder}
                </p>
            </div>
            {error ? <p className={styles.error}>!</p> : null}
        </div>
    );
};

export default InputFile;
