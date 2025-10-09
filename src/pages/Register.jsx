import { useState } from "react";
import PageNav from "../components/PageNav";
import styles from "./Auth.module.css";
import Button from "../components/Button";

function Register() {
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <main className={styles.register}>
      <PageNav />
      <form className={`${styles.form} ${styles.box}`} onSubmit={handleSubmit}>
        <h1>Zarejestruj się</h1>
        <div className={styles.row}>
          <h2>login</h2>
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            onChange={(e) => setCreateUsername(e.target.value)}
          ></input>
        </div>
        <div className={styles.row}>
          <h2> hasło</h2>
          <input
            type="password"
            placeholder="haslo"
            onChange={(e) => setCreatePassword(e.target.value)}
          ></input>
        </div>
        <div>
          <Button type="primary">Zarejestruj się</Button>
        </div>
        <h2>{createUsername}</h2>
        <h2>{createPassword}</h2>
      </form>
    </main>
  );
}

export default Register;
