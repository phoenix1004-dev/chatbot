import React from "react";
import styles from "./ThreeDotsLoading.module.css";

export const ThreeDotsLoading: React.FC = () => {
  return (
    <div className={styles.typing}>
      <div className={styles.typing__dot}></div>
      <div className={styles.typing__dot}></div>
      <div className={styles.typing__dot}></div>
    </div>
  );
};
