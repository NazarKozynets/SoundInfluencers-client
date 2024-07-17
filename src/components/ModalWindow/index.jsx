import React, { useEffect } from "react";
import styles from "./style.module.css";
import close from "../../images/icons/close.svg";

const ModalWindow = ({ children, isOpen = false, setClose, header = "" }) => {
  const changeStateModal = () => {
    setClose(!isOpen);
  };

  return (
    <div
      data-head="backdrop"
      className={styles.backdrop}
      style={{
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "all" : "none",
      }}
      // onClick={closeInBackdrop}
    >
      <div className={styles.modal}>
        <button onClick={changeStateModal} className={styles.close}>
          <img src={close} />
        </button>
        {header && (
          <div className={styles.modalHeader}>
            <p className={styles.modalHeaderTitle}>{header}</p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalWindow;
