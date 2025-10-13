import PageNav from "../components/PageNav";
import styles from "./about.module.css";
function About() {
  return (
    <div className={styles.about}>
      <PageNav />
      <div>
        <h1 className={styles.header}>O nas</h1>
      </div>
      <h2>
        FootTeam to aplikacja stworzona z myślą o drużynach sportowych,
        trenerach, rodzicach i zawodnikach. Naszym celem jest ułatwienie
        komunikacji, organizacji treningów i zarządzania drużyną w jednym,
        prostym narzędziu. W aplikacji znajdziesz kalendarz spotkań, moduł
        płatności, powiadomienia oraz system ról, dzięki którym każdy użytkownik
        ma dostęp tylko do potrzebnych funkcji. FootTeam powstał z pasji do
        sportu i nowoczesnych technologii — chcemy, by codzienne funkcjonowanie
        drużyny było łatwiejsze, bardziej przejrzyste i zorganizowane. Wierzymy,
        że dobra współpraca zaczyna się od dobrej komunikacji.
      </h2>
    </div>
  );
}

export default About;
