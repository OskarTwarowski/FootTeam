import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../Hooks/validators";
import styles from "../pages/Auth.module.css";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FAKE_PROFILES, FAKE_USERS } from "../mockData";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/features/authSlice";
import { fetchProfiles } from "../store/features/profileSlice";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    dispatch(loginUser({ email: data.email, password: data.password }))
      .unwrap()
      .then((res) => {
        const foundProfiles = FAKE_PROFILES.filter(
          (p) => p.UserID === res.user.UserID
        );

        // zapis do localStorage
        const existingProfiles =
          JSON.parse(localStorage.getItem("Profiles")) || [];

        // foundProfiles może być tablicą — spłaszczamy
        const profilesToAdd = Array.isArray(foundProfiles)
          ? foundProfiles
          : [foundProfiles];

        profilesToAdd.forEach((p) => {
          if (!existingProfiles.some((ep) => ep.PlayerID === p.PlayerID)) {
            existingProfiles.push(p);
          }
        });

        localStorage.setItem("Profiles", JSON.stringify(existingProfiles));

        // fetchujemy profile do redux
        dispatch(fetchProfiles());

        navigate("/app/profil", { replace: true });
      })
      .catch(() => {
        setError("email", {
          type: "manual",
          message: "Zły login lub hasło",
        });
      });
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
        {errors.email && (
          <p className={styles.instructions}>
            <FontAwesomeIcon icon={faInfoCircle} /> {errors.email.message}
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
        <Button type="primary" disabled={!isValid}>
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
