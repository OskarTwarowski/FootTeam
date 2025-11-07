import styles from "../components/ContactSection.module.css";

function ContactSection() {
  return (
    <section className={styles.contact}>
      <div className={styles.container}>
        <h2>💬 Skontaktuj się z nami</h2>
        <p>
          Masz pytania lub chcesz nawiązać współpracę?
          <br />
          Napisz do nas – chętnie porozmawiamy o tym, jak FootTeam może pomóc
          Twojej drużynie!
        </p>
        <a href="mailto:kontakt@footteam.pl" className={styles.button}>
          Napisz do nas
        </a>
      </div>
    </section>
  );
}

export default ContactSection;
