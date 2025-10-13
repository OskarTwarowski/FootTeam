export const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
// hasło 6-24 znaki, jedna Litera, jedna cyfra 0-9 moze zawierac znaki specjalne oprócz ^ ()
export const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#^()]{6,24}$/;

export const validateUser = (user) => USER_REGEX.test(user);
export const validatePassword = (password) => PWD_REGEX.test(password);
export const validateMatch = (password, match) => password === match;
