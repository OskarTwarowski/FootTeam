import { useEffect, useState } from "react";
import ProfileCreateForm from "./ProfileCreateForm";
import { Button as BsButton } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

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
      <BsButton onClick={handleOpen}>Utwórz profil</BsButton>
      <ProfileCreateForm show={showModal} onClose={handleClose} />
    </>
  );
}
