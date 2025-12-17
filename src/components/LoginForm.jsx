import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../Hooks/validators";
import styles from "../pages/Auth.module.css";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/features/authSlice";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  // -----------------------------------------------------------------------------
  const onSubmit = (data) => {
    dispatch(loginUser({ email: data.email, password: data.password }))
      .unwrap()
      .then((res) => {
        navigate("/app/profil", { replace: true });
      })
      .catch(() => {
        setError("email", {
          type: "manual",
          message: "Zły email lub hasło",
        });
      });
  };
  // -----------------------------------------------------------------------------

  return (
    <form
      className={`${styles.form} ${styles.box}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>Logowanie</h1>

      {/* EMAIL */}
      <div className={styles.row}>
        <label htmlFor="email">Email użytkownika:</label>
        <input
          type="email"
          id="email"
          placeholder="adres@email.com"
          {...register("email")}
        />

        {errors.email && (
          <p className={styles.instructions}>
            <FontAwesomeIcon icon={faInfoCircle} /> {errors.email.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}
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

      {/* BŁĄD Z REDUX */}
      {error && (
        <p className={styles.instructions} style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* SUBMIT */}
      <div>
        <Button type="primary" disabled={!isValid || status === "loading"}>
          {status === "loading" ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </div>

      <p className={styles.alrRegistered}>
        Nie masz konta? <br />
        <Link to="/rejestracja" className={styles.backLogin}>
          Zarejestruj się
        </Link>
      </p>
    </form>
  );
}
