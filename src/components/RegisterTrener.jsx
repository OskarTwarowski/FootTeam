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

import { register as apiRegister } from "../API/auth";

export default function RegisterForm() {
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

  const onSubmit = async (data) => {
    try {
      const role = "Coach"; // 👈 TWOJA WYMAGANA ROLA

      await apiRegister(data.email, data.password, role);

      alert("Konto trenera zostało utworzone!");
      navigate("/logowanie", { replace: true });
    } catch (err) {
      alert("Rejestracja nie powiodła się. Spróbuj ponownie.");
    }
  };

  return (
    <div className={styles.register}>
      <form
        className={`${styles.form} ${styles.box}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Zarejestruj się jako Trener</h1>

        {/* EMAIL */}
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

        {/* CONFIRM PASSWORD */}
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

        {/* TERMS */}
        <div className={styles.checkboxRow}>
          <label htmlFor="terms" className={styles.checkboxLabel}>
            <input type="checkbox" id="terms" {...register("terms")} />
            <span>
              Akceptuję{" "}
              <Link to="/regulamin" className={styles.link}>
                Regulamin
              </Link>{" "}
              i{" "}
              <Link to="/polityka-prywatnosci" className={styles.link}>
                Politykę Prywatności
              </Link>
            </span>
          </label>

          {errors.terms && (
            <p className={styles.instructions}>
              <FontAwesomeIcon icon={faInfoCircle} /> {errors.terms.message}
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <div className={styles.middle}>
          <Button type="primary" disabled={!isValid}>
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
    </div>
  );
}
