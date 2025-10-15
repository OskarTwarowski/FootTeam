import * as yup from "yup";

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .matches(
      /^[A-Za-z][A-Za-z0-9-_]{3,23}$/,
      "Nazwa użytkownika musi zaczynać się literą i mieć 4–24 znaki"
    )
    .required("Nazwa użytkownika jest wymagana"),
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#^()_\-]{6,24}$/,
      "Hasło musi mieć 6–24 znaki, zawierać literę i cyfrę"
    )
    .required("Hasło jest wymagane"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Hasła muszą być takie same")
    .required("Powtórz hasło"),
});
export const loginSchema = yup.object({
  username: yup
    .string()
    .required("Nazwa użytkownika jest wymagana")
    .min(4, "Minimum 4 znaki"),
  password: yup
    .string()
    .required("Hasło jest wymagane")
    .min(6, "Minimum 6 znaków"),
});
