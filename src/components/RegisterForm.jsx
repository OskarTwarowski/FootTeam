import { useState, useRef, useEffect } from "react";
import styles from "../pages/Auth.module.css";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import {
  validateUser,
  validatePassword,
  validateMatch,
} from "../Hooks/validators";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RegisterForm() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [userTouched, setUserTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  useEffect(() => {
    setValidName(validateUser(user));
  }, [user]);

  useEffect(() => {
    setValidPassword(validatePassword(password));
    setValidMatch(validateMatch(password, matchPassword));
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [user, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, password);
    // tutaj submit do backendu
    setSuccess(true);
  };

  return (
    <form className={`${styles.form} ${styles.box}`} onSubmit={handleSubmit}>
      <h1>Zarejestruj się</h1>
      {errMsg && <p className={styles.errmsg}>{errMsg}</p>}
      <div className={styles.row}>
        <label htmlFor="username">
          Nazwa użytkownika:
          <span className={validName ? styles.valid : styles.hide}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span
            className={!validName && userTouched ? styles.invalid : styles.hide}
          >
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>

        <input
          type="text"
          placeholder="Nazwa użytkownika"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => {
            setUser(e.target.value);
            setUserTouched(true);
          }}
          required
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
        />

        <p
          className={
            userFocus && userTouched && !validName
              ? styles.instructions
              : styles.hide
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Od 4 do 24 znaków. Musi zaczynać się literą.
        </p>
      </div>
      <div className={styles.row}>
        <label htmlFor="password">
          Hasło:
          <span className={validPassword ? styles.valid : styles.hide}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span
            className={
              !validPassword && passwordTouched ? styles.invalid : styles.hide
            }
          >
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="password"
          id="password"
          placeholder="Hasło"
          onChange={(e) =>
            setPassword(e.target.value, setPasswordTouched(true))
          }
          required
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
        <div
          className={
            passwordFocus && passwordTouched && !validPassword
              ? styles.instructions
              : styles.hide
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          <ul className={styles.noDots}>
            <li>8–24 znaki</li>
            <li>co najmniej 1 literę</li>
            <li>co najmniej 1 cyfrę</li>
          </ul>
        </div>
      </div>
      <div className={styles.row}>
        <label htmlFor="confirm_password">
          Powtórz hasło
          <span
            className={validMatch && matchPassword ? styles.valid : styles.hide}
          >
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span
            className={
              validMatch || !matchPassword ? styles.hide : styles.invalid
            }
          >
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="password"
          id="confirm_pwd"
          placeholder="Powtórz hasło"
          onChange={(e) => setMatchPassword(e.target.value)}
          required
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
      </div>
      <p
        id="confirmnote"
        className={
          matchFocus && !validMatch ? styles.instructions : styles.hide
        }
      >
        <FontAwesomeIcon icon={faInfoCircle} />
        hasła musza być takie same
      </p>
      <div>
        <Button
          type="primary"
          disabled={!validName || validPassword || validMatch ? true : false}
        >
          Zarejestruj się
        </Button>
      </div>
      <p className={styles.alrRegistered}>
        Posiadasz już konto? <br />
        <Link to="/logowanie" className={styles.backLogin}>
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
