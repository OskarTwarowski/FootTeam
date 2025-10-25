// src/data/profileService.js
export function getProfiles() {
  const stored = JSON.parse(localStorage.getItem("Profiles")) || [];

  // Spłaszczenie tablicy — usuwa przypadkowe [[...]]
  const normalized = stored.flatMap((p) => (Array.isArray(p) ? p : [p]));

  return normalized;
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

export function removeProfile(profileToRemove) {
  const profiles = getProfiles();
  const updated = profiles.filter(
    (p) => p.PlayerID !== profileToRemove.PlayerID
  );
  localStorage.setItem("Profiles", JSON.stringify(updated));
  window.dispatchEvent(new Event("storage"));
}
