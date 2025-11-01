import { FAKE_EVENTS } from "../mockData";

const STORAGE_KEY = "Trainings";

function initializeTrainings() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!stored || stored.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(FAKE_EVENTS));
  }
}

export function getTrainings() {
  initializeTrainings();
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveTrainings(trainings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trainings));
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
