import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "../components/CarouselSection.module.css";

const testimonials = [
  {
    name: "Kamil Z.",
    role: "Trener U-18",
    text: "FootTeam to rewolucja w organizacji drużyn.",
  },
  {
    name: "Oskar T.",
    role: "Rodzic zawodnika",
    text: "Wreszcie wiem, kiedy są treningi i mecze moich dzieci.",
  },
  {
    name: "Krzysztof K.",
    role: "Trener U-14",
    text: "Prosty system, idealny do zarządzania młodzieżą.",
  },
];

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

function CarouselSection() {
  return (
    <div className={styles.carouselSection}>
      <h2 className={styles.heading}>Opinie użytkowników</h2>
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={4000}
        arrows={false}
        showDots
      >
        {testimonials.map((t, i) => (
          <div key={i} className={styles.card}>
            <p className={styles.text}>"{t.text}"</p>
            <h4 className={styles.name}>{t.name}</h4>
            <p className={styles.role}>{t.role}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default CarouselSection;
