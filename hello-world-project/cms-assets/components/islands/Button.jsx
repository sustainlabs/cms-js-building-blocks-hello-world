import styles from "../../styles/todo.module.css";

function Button(props) {
  return (
    <button
      disabled={props.disabled}
      className={styles.button}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
