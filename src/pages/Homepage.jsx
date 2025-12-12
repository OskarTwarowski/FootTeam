import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PageNav from "../components/PageNav";
import CarouselSection from "./AppLayout/components/CarouselSection";
import styles from "./Homepage.module.css";
import ContactSection from "./AppLayout/components/ContactSection";
import Footer from "./AppLayout/components/Footer";

function Homepage() {
  const user = useSelector((state) => state?.auth?.user ?? null);

  return (
    <main className={styles.homepage}>
      <PageNav />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1> Witaj w FootTeam!</h1>
          <h2>Proste i przyjemne zarządzanie drużyną</h2>
          <p>
            Zorganizuj swoją drużynę jak profesjonalista. Dzięki FootTeam z
            łatwością zaplanujesz treningi, prześlesz powiadomienia zawodnikom i
            utrzymasz doskonałą komunikację w zespole. wszystko w jednym
            miejscu.
          </p>

          <Link to={user ? "app" : "/logowanie"} className={styles.cta}>
            Przejdź do aplikacji
          </Link>

          <Link to="/rejestracja-trener" className={styles.cta}>
            Zostań Trenerem
          </Link>
        </div>
      </section>

      <section className={styles.testimonials}>
        <CarouselSection />
      </section>

      <ContactSection />
      <Footer />
    </main>
  );
}

export default Homepage;
