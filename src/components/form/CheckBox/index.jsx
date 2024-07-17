import React from "react";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";

const CheckBox = ({
  page = "client",
  checked = false,
  setChecked,
  text = "",
  linkText,
  style,
}) => {
  const navigation = useNavigate();
  return (
    <div className={styles.block} style={style}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setChecked(!checked)}
      >
        <div className={styles.checkbox}>
          {checked && <div className={styles.decor}></div>}
        </div>
        <p className={styles.text}>
          {text}{" "}
          <button
            style={{
              cursor: "pointer",
              color: "#3330E4",
              fontFamily: "Geometria",
              fontSize: 14,
              fontWeight: 700,
              textDecorationLine: "underline",
            }}
            type="button"
            onClick={() => {
              if (page === "client") {
                const win = window.open("/terms-client", "_blank");
                win.focus();
              } else {
                const win = window.open("/terms-influencer", "_blank");
                win.focus();
              }
            }}
          >
            {linkText}
          </button>
        </p>
      </button>
    </div>
  );
};

export default CheckBox;
