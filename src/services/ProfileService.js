// src/data/profileService.js
export function getProfiles() {
  const stored = JSON.parse(localStorage.getItem("Profiles")) || [];

  // Spłaszczenie tablicy — usuwa przypadkowe [[...]]
  const normalized = stored.flatMap((p) => (Array.isArray(p) ? p : [p]));

  return normalized;
}

export function saveProfiles(profiles) {
  localStorage.setItem("Profiles", JSON.stringify(profiles));
}

export function addProfile(profile) {
  const profiles = getProfiles();
  profiles.push(profile);
  saveProfiles(profiles);

  // powiadom inne komponenty, że localStorage się zmienił
  window.dispatchEvent(new Event("storage"));
}

export function removeProfile(userID) {
  const profiles = getProfiles().filter((p) => p.UserID !== userID);
  saveProfiles(profiles);
  window.dispatchEvent(new Event("storage"));
}
