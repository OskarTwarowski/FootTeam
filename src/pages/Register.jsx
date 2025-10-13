import PageNav from "../components/PageNav";
import RegisterForm from "../components/RegisterForm";
import styles from "./Auth.module.css";

export default function Register() {
  return (
    <main className={styles.register}>
      <PageNav />
      <RegisterForm />
    </main>
  );
}
