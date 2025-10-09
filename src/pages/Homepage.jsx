import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";

function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>FootTeam</h1>
        <h1>Proste i przyjemne zarządzanie druzyną</h1>
        <h2>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam
          eaque iusto qui maxime nesciunt alias quae mollitia inventore! Debitis
          voluptatem architecto quasi hic sit quas consectetur maiores quaerat
          officia in.
        </h2>
        {/* link do usunięcia w przyszłości, pomija logowanie */}
        <Link to="app" className="cta">
          app
        </Link>
      </section>
    </main>
  );
}

export default Homepage;
