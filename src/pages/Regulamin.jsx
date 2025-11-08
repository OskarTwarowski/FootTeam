import { useNavigate } from "react-router-dom";
import styles from "./Legal.module.css";

function Regulamin() {
  const navigate = useNavigate();

  return (
    <main className={styles.legalPage}>
      <h1> Regulamin korzystania z aplikacji FootTeam</h1>
      <section>
        <p>
          Niniejszy regulamin określa zasady korzystania z aplikacji FootTeam,
          która umożliwia organizację drużyn sportowych, zarządzanie treningami
          i komunikację pomiędzy trenerami, zawodnikami oraz rodzicami.
        </p>
        <h2>§1. Postanowienia ogólne</h2>
        <p>
          1. Korzystanie z aplikacji jest równoznaczne z akceptacją niniejszego
          regulaminu. <br />
          2. Użytkownik zobowiązuje się do korzystania z aplikacji zgodnie z jej
          przeznaczeniem i obowiązującymi przepisami prawa.
        </p>

        <h2>§2. Rejestracja i dane użytkowników</h2>
        <p>
          1. Rejestracja w aplikacji jest dobrowolna, ale wymaga podania
          prawdziwych danych. <br />
          2. Dane osobowe są przetwarzane zgodnie z Polityką Prywatności.
        </p>
        <h2>§3. Postanowienia przed końcowe</h2>
        <p>
          zespół footTeam nie odpowiada za żadne problemy prawne wynikające z
          naszej niewiedzy.
        </p>

        <h2>§4. Postanowienia końcowe</h2>
        <p>
          FootTeam zastrzega sobie prawo do wprowadzania zmian w regulaminie.
          Aktualna wersja regulaminu będzie dostępna na stronie internetowej
          aplikacji.
        </p>
      </section>

      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        ← Powrót
      </button>
    </main>
  );
}

export default Regulamin;
