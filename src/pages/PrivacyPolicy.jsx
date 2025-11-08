import { useNavigate } from "react-router-dom";
import styles from "./Legal.module.css";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <main className={styles.legalPage}>
      <h1> Polityka Prywatności FootTeam</h1>
      <section>
        <p>
          Dbamy o prywatność użytkowników FootTeam. Poniżej opisujemy, w jaki
          sposób gromadzimy, przetwarzamy i chronimy dane osobowe.
        </p>

        <h2>1. Administrator danych</h2>
        <p>
          Administratorem danych osobowych jest FootTeam Kamil Z. (Lębork?
          Polska). Kontakt: KamilZakolski@gmail.com.
        </p>

        <h2>2. Zakres zbieranych danych</h2>
        <p>
          W ramach aplikacji przetwarzane są dane takie jak imię, nazwisko,
          adres e-mail, rola w drużynie oraz dane kontaktowe rodziców lub
          trenerów.
        </p>

        <h2>3. Cel przetwarzania danych</h2>
        <p>
          Dane są przetwarzane wyłącznie w celu umożliwienia korzystania z
          aplikacji oraz usprawnienia komunikacji w drużynie.
        </p>

        <h2>4. Prawa użytkownika</h2>
        <p>
          Użytkownik ma prawo do wglądu, sprostowania, ograniczenia
          przetwarzania oraz usunięcia swoich danych. Wszelkie wnioski można
          kierować na adres kontaktowy aplikacji.
        </p>
      </section>

      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        ← Powrót
      </button>
    </main>
  );
}

export default PrivacyPolicy;
