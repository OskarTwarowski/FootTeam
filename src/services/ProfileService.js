export function getProfiles() {
  const stored = JSON.parse(localStorage.getItem("Profiles")) || [];
  // usuwa zagnieżdżenia, jeśli jeszcze jakieś są
  return stored.flatMap((p) => (Array.isArray(p) ? p : [p]));
}

export function saveProfiles(profiles) {
  localStorage.setItem("Profiles", JSON.stringify(profiles));
  window.dispatchEvent(new Event("storage"));
}

export function addProfile(profile) {
  const profiles = getProfiles();
  profiles.push(profile);
  saveProfiles(profiles);
  // powiadom inne komponent, że localStorage się zmienił
  window.dispatchEvent(new Event("storage"));
}
export function updateProfile(updatedProfile) {
  const profiles = getProfiles();
  const index = profiles.findIndex(
    (p) => p.PlayerID === updatedProfile.PlayerID
  );

  if (index === -1) return null;

  profiles[index] = updatedProfile;
  saveProfiles(profiles);
  window.dispatchEvent(new Event("storage"));
  return updatedProfile;
}

export function removeProfile(profileToRemove) {
  const profiles = getProfiles();
  const updated = profiles.filter(
    (p) => p.PlayerID !== profileToRemove.PlayerID
  );
  localStorage.setItem("Profiles", JSON.stringify(updated));
  window.dispatchEvent(new Event("storage"));
}
