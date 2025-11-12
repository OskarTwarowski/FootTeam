export const getPlayers = async () => {
  const res = await fetch(`http://localhost:5100/api/players`);
  console.log(res);
};
export const getHealth = async () => {
  const res = await fetch(`http://localhost:5100/api/health`);
  console.log(res);
};
