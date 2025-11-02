import { useEffect, useState } from "react";
import ProfileEditForm from "./ProfileEditForm";
import { Button as BsButton } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProfileEditButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const activeProfile = useSelector((state) => state.activeProfile.profile);

  useEffect(() => {
    if (location.pathname.endsWith("/edytuj-profil")) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [location]);

  const handleOpen = () => {
    if (!activeProfile) return;
    navigate("/app/profil/edytuj-profil");
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/app/profil");
  };

  return (
    <>
      <BsButton
        onClick={handleOpen}
        disabled={!activeProfile} // przycisk nieaktywny jeśli brak wybranego profilu
      >
        Edytuj Profil
      </BsButton>

      <ProfileEditForm show={showModal} onClose={handleClose} />
    </>
  );
}

export default ProfileEditButton;
