import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import CarouselSection from "./AppLayout/components/CarouselSection";
import styles from "./Homepage.module.css";
import ContactSection from "./AppLayout/components/ContactSection";
import Footer from "./AppLayout/components/Footer";

function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>⚽️ Witaj w FootTeam!</h1>
          <h2>Proste i przyjemne zarządzanie drużyną</h2>
          <p>
            Zorganizuj swoją drużynę jak profesjonalista. Dzięki FootTeam z
            łatwością zaplanujesz treningi, prześlesz powiadomienia zawodnikom i
            utrzymasz doskonałą komunikację w zespole – wszystko w jednym
            miejscu. Nieważne, czy jesteś trenerem czy rodzicem, FootTeam pomoże
            Ci być zawsze na bieżąco i działać skuteczniej.
          </p>
          {/*do usunięcia */}
          <Link to="app" className={styles.cta}>
            Przejdź do aplikacji
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className={styles.testimonials}>
        <CarouselSection />
      </section>
      <ContactSection />
      <Footer />
    </main>
  );
}

export default Homepage;
