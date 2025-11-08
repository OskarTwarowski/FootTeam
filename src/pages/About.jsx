import PageNav from "../components/PageNav";
import styles from "./About.module.css";
import Footer from "../pages/AppLayout/components/Footer";
import { FaGithub } from "react-icons/fa";
function About() {
  return (
    <main className={styles.about}>
      <PageNav />
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.content}>
            <h1> O nas</h1>
            <h2>
              FootTeam to aplikacja stworzona z myślą o drużynach sportowych,
              trenerach, rodzicach i zawodnikach. Naszym celem jest ułatwienie
              komunikacji, organizacji treningów i zarządzania drużyną w jednym,
              prostym narzędziu.
            </h2>
            <p>
              W aplikacji znajdziesz kalendarz spotkań, moduł płatności,
              powiadomienia oraz system ról, dzięki którym każdy użytkownik ma
              dostęp tylko do potrzebnych funkcji. FootTeam powstał z pasji do
              sportu i nowoczesnych technologii. Chcemy, by codzienne
              funkcjonowanie drużyny było łatwiejsze, bardziej przejrzyste i
              zorganizowane. Wierzymy, że dobra współpraca zaczyna się od dobrej
              komunikacji.
            </p>
          </div>
        </section>
        <div className={styles.links}>
          <a
            href="https://github.com/KamilZakolski"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub /> Kamil
          </a>
          <a
            href="https://github.com/OskarTwarowski"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub /> Oskar
          </a>
          <a
            href="https://github.com/kKaminski195"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            Krzysztof
          </a>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default About;
