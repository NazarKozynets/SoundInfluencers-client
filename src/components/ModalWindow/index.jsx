import React, { useEffect, useRef } from "react";
import styles from "./style.module.css";
import close from "../../images/icons/close.svg";

const ModalWindow = ({ children, isOpen = false, setClose, header = "" }) => {
    // const modalRef = useRef(null);

    const changeStateModal = () => {
        setClose(!isOpen);
    };

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (modalRef.current && !modalRef.current.contains(event.target)) {
    //             setClose(false);
    //         }
    //     };
    //
    //     document.addEventListener("mousedown", handleClickOutside);
    //
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [setClose]);

    return (
        <div
            data-head="backdrop"
            className={styles.backdrop}
            style={{
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? "all" : "none",
            }}
        >
            <div className={styles.modal}>
                <button onClick={changeStateModal} className={styles.close}>
                    <img src={close} alt="Close" />
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
