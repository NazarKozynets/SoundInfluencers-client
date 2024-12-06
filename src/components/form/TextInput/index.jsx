import React from "react";
import styles from "./style.module.css";
import timeIcon from "../../../images/icons/time.svg";
import {validateTextInput} from "../../../utils/validations";

const TextInput = ({
                       value = "",
                       setValue,
                       title = "",
                       placeholder = "",
                       error = false,
                       style = {},
                       type = "text",
                       disabled = false,
                       disabledTime = "24",
                       silverColor = false,
                       ...args
                   }) => {

    const handleBeforeInput = (event) => {
        const char = event.data;

        if (!validateTextInput(char)) {
            event.preventDefault();
        }
    };

    return (
        <div className={styles.block} style={style}>
            <label className={styles.label}>
                <p className={styles.title}>{title}</p>
                <input
                    type={type}
                    style={{
                        borderColor: error ? "#FB1E1E" : "transparent",
                        padding: style.padding ? style.padding : "13px 33px",
                    }}
                    className={silverColor ? styles.inputSilver : styles.input}
                    placeholder={disabled ? "" : placeholder}
                    value={value}
                    onChange={({target}) => setValue(target.value)}
                    onBeforeInput={handleBeforeInput}
                    disabled={disabled}
                    autoComplete="off"
                    {...args}
                />
                {disabled ? (
                    <div className={styles.disabled}>
                        <img className={styles.disabledIcon} src={timeIcon}/>
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

export default TextInput;
