import { useEffect, useState } from "react";
import ProfileCreateForm from "./ProfileCreateForm";
import { Button as BsButton } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import styles from "./ProfileEditButton.module.css";

export default function ProfileModalButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.pathname.endsWith("/dodaj-profil")) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [location]);

  const handleOpen = () => navigate("/app/profil/dodaj-profil");
  const handleClose = () => {
    setShowModal(false);
    navigate("/app/profil");
  };
  return (
    <>
      <BsButton onClick={handleOpen} className={styles.buttonAdd}>
        <UserPlus className={styles.marginRight} />
        Utwórz profil
      </BsButton>
      <ProfileCreateForm show={showModal} onClose={handleClose} />
    </>
  );
}
