import PageNav from "../components/PageNav";
import styles from "./Auth.module.css";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <main className={styles.login}>
      <PageNav />
      <LoginForm />
    </main>
  );
}

export default Login;
