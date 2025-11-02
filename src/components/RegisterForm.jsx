import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../Hooks/validators";
import styles from "../pages/Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getUsers, saveUsers } from "../services/AuthService";

export default function RegisterForm() {
  // do usuniecia
  const generateUserId = () =>
    Math.random().toString(36).substring(2, 9) + "-" + Date.now().toString(36);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });
  // tutaj trzeba dodanie do backednu zrobić
  const onSubmit = (data) => {
    const users = getUsers();
    const userExists = users.some((u) => u.Email === data.email);
    if (userExists) {
      alert("Użytkownik o tym adresie e-mail już istnieje.");
      return;
    }
    const newUser = {
      Email: data.email,
      PasswordHash: data.password,
      Role: "Rodzic",
      CreatedAt: new Date().toISOString(),
      UserID: generateUserId(),
    };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    localStorage.setItem("loggedUser", JSON.stringify(newUser));

    const profiles = JSON.parse(localStorage.getItem("Profiles")) || [];
    localStorage.setItem("Profiles", JSON.stringify(profiles));
    navigate("/app/profil", { replace: true });
  };

  return (
    <form
      className={`${styles.form} ${styles.box}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>Zarejestruj się</h1>

      {/* EMAIL uzytkownika */}
      <div className={styles.row}>
        <label htmlFor="email">
          Adres e-mail:
          {!errors.email && watch("email") ? (
            <span className={styles.valid}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
          ) : errors.email && watch("email") ? (
            <span className={styles.invalid}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          ) : null}
        </label>

        <input
          type="email"
          id="email"
          placeholder="example@email.com"
          autoComplete="off"
          {...register("email")}
        />

        {errors.email && (
          <p className={styles.instructions}>
            <FontAwesomeIcon icon={faInfoCircle} /> {errors.email.message}
          </p>
        )}
      </div>

      {/*  hasło */}
      <div className={styles.row}>
        <label htmlFor="password">
          Hasło:
          {!errors.password && watch("password") ? (
            <span className={styles.valid}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
          ) : errors.password && watch("password") ? (
            <span className={styles.invalid}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          ) : null}
        </label>

        <input
          type="password"
          id="password"
          placeholder="Hasło"
          {...register("password")}
        />

        {errors.password && (
          <div className={styles.instructions}>
            <FontAwesomeIcon icon={faInfoCircle} />
            <ul className={styles.noDots}>
              <li>8–24 znaki</li>
              <li>co najmniej 1 literę</li>
              <li>co najmniej 1 cyfrę</li>
            </ul>
          </div>
        )}
      </div>

      {/*  confirm hasło  */}
      <div className={styles.row}>
        <label htmlFor="confirmPassword">
          Powtórz hasło:
          {!errors.confirmPassword && watch("confirmPassword") ? (
            <span className={styles.valid}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
          ) : errors.confirmPassword && watch("confirmPassword") ? (
            <span className={styles.invalid}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          ) : null}
        </label>

        <input
          type="password"
          id="confirmPassword"
          placeholder="Powtórz hasło"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className={styles.instructions}>
            <FontAwesomeIcon icon={faInfoCircle} />{" "}
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* handle submit button */}
      <div>
        <Button type="primary" disabled={!isValid}>
          Zarejestruj się
        </Button>
      </div>

      {/* przekierowanie do logowania */}
      <p className={styles.alrRegistered}>
        Posiadasz już konto? <br />
        <Link to="/logowanie" className={styles.backLogin}>
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
