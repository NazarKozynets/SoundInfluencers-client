import React, { useState } from "react";
import styles from "./style.module.css";

const SelectedInput = ({
  data = [],
  changeValue,
  title = "",
  placeholder = "",
  error = false,
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.block} style={style}>
      <div
        className={styles.label}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className={styles.title}>{title}</p>
        <div
          className={styles.input}
          style={{ borderColor: error ? "#FB1E1E" : "transparent" }}
        >
          <p className={styles.placeholder}>{placeholder}</p>

          <div
            className={styles.selected}
            style={{
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? "all" : "none",
            }}
          >
            {data.length !== 0 && (
              <>
                {data.map((item) => (
                  <button
                    key={item}
                    className={styles.item}
                    type="button"
                    onClick={() => {
                      changeValue(item);
                      setIsOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {error ? <p className={styles.error}>!</p> : <></>}
      </div>
    </div>
  );
};

export default SelectedInput;
