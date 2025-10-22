import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../Hooks/validators";
import styles from "../pages/Auth.module.css";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FAKE_USERS } from "../mockData";

export default function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });
  //-----------------------------------------------------------------------------------
  const onSubmit = (data) => {
    const foundUser = FAKE_USERS.find(
      (u) => u.Email === data.email && u.PasswordHash === data.password
    );
    if (foundUser) {
      console.log("Zalogowano jako:", foundUser.Role);
      navigate("/app", { replace: true });
      localStorage.setItem("loggedUser", JSON.stringify(foundUser));
    } else {
      setError("username", {
        type: "manual",
        message: "Zły login lub hasło",
      });
    }
  };
  //-----------------------------------------------------------------------------------
  return (
    <form
      className={`${styles.form} ${styles.box}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>Logowanie</h1>

      {/* === USERNAME === */}
      <div className={styles.row}>
        <label htmlFor="email">Email użytkownika:</label>
        <input
          type="email"
          id="email"
          placeholder="adres@email.com"
          {...register("email")}
        />
        {errors.username && (
          <p className={styles.instructions}>
            <FontAwesomeIcon icon={faInfoCircle} /> {errors.username.message}
          </p>
        )}
      </div>

      {/* === PASSWORD === */}
      <div className={styles.row}>
        <label htmlFor="password">Hasło:</label>
        <input
          type="password"
          id="password"
          placeholder="Hasło"
          {...register("password")}
        />
        {errors.password && (
          <p className={styles.instructions}>
            <FontAwesomeIcon icon={faInfoCircle} /> {errors.password.message}
          </p>
        )}
      </div>

      {/* === SUBMIT BUTTON === */}
      <div>
        <Button type="primary" disablessssssssd={!isValid}>
          Zaloguj się
        </Button>
      </div>

      {/* === REGISTER LINK === */}
      <p className={styles.alrRegistered}>
        Nie masz konta? <br />
        <Link to="/rejestracja" className={styles.backLogin}>
          Zarejestruj się
        </Link>
      </p>
    </form>
  );
}
