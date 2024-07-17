import React, { useRef } from "react";
import styles from "./style.module.css";

const NumberCode = ({ setNumberCode, value }) => {
  // Создаем массив для хранения рефов для каждого инпута
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Функция для перехода к следующему инпуту после ввода цифры
  const handleInput = (index) => (e) => {
    const input = e.target;
    if (!/^\d*$/.test(input.value)) {
      e.target.value = "";
      return;
    }

    const newValue = [...value];
    newValue[index] = e.target.value;
    setNumberCode(newValue);

    if (input.value) {
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus(); // Переход к следующему инпуту
      }
    } else {
      if (index > 0) {
        inputRefs[index - 1].current.focus(); // Если удалена цифра, переход к предыдущему инпуту
      }
    }
  };

  return (
    <div className={styles.block}>
      <input
        ref={inputRefs[0]}
        className={styles.input1}
        type="tel"
        maxLength={1}
        onChange={handleInput(0)}
      />
      <input
        ref={inputRefs[1]}
        className={styles.input2}
        type="tel"
        maxLength={1}
        onChange={handleInput(1)}
      />
      <input
        ref={inputRefs[2]}
        className={styles.input3}
        type="tel"
        maxLength={1}
        onChange={handleInput(2)}
      />
      <input
        ref={inputRefs[3]}
        className={styles.input4}
        type="tel"
        maxLength={1}
        onChange={handleInput(3)}
      />
    </div>
  );
};

export default NumberCode;
