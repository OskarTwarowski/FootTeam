import { FAKE_EVENTS } from "../mockData";

export function getTrainings() {
  const stored = JSON.parse(localStorage.getItem("Trainings"));
  return stored && stored.length > 0 ? stored : FAKE_EVENTS;
}

export function saveTrainings(trainings) {
  localStorage.setItem("Trainings", JSON.stringify(trainings));
  window.dispatchEvent(new Event("storage"));
}

export function addTraining(training) {
  const trainings = getTrainings();
  trainings.push(training);
  saveTrainings(trainings);
  return training;
}
export function updateTraining(updated) {
  const trainings = getTrainings();
  const index = trainings.findIndex((t) => t.TrainingID === updated.TrainingID);
  if (index === -1) return null;
  trainings[index] = updated;
  saveTrainings(trainings);
  return updated;
}
export function removeTraining(training) {
  const trainings = getTrainings().filter(
    (t) => t.TrainingID !== training.TrainingID
  );
  saveTrainings(trainings);
  return training;
}
