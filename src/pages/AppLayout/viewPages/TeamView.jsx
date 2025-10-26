import { useSelector } from "react-redux";

function TeamView() {
  const activeProfile = useSelector((state) => state.activeProfile.profile);

  return <div></div>;
}

export default TeamView;
