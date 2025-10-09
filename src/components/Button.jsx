import styles from "./Button.module.css";
function Button({ children, onClick, type }) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  );
}
//type to typ przycisku. opisane są w Button.module.css

export default Button;
