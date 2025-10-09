import PageNav from "../components/PageNav";
import styles from "./Auth.module.css";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  // sztuczny uzytkownik
  const FAKE_USER = {
    username: "admin",
    password: "ass",
  };
  // logowanie -- do zmiany
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  //funkcja logowania
  function handleSubmit(e) {
    e.preventDefault();
    if (username === FAKE_USER.username && password === FAKE_USER.password) {
      setLoggedIn(true);
      setError(" ");
    } else {
      setError("niepoprawny login lub hasło");
    }
  }
  useEffect(
    function () {
      if (loggedIn) navigate("/app", { replace: true });
    },
    [loggedIn, navigate]
  );
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <h2>login</h2>
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div className={styles.row}>
          <h2> hasło</h2>
          <input
            type="password"
            placeholder="haslo"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <Button type="primary">Zaloguj się</Button>
        </div>
        {loggedIn && <h1>pomyślnie zalogowany</h1>}
        {error.length > 2 && <h1>{error}</h1>}
      </form>
    </main>
  );
}

export default Login;
