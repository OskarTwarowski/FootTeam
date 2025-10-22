import * as yup from "yup";

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Niepoprawny adres e-mail")
    .required("Adres e-mail jest wymagany"),

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
  email: yup
    .string()
    .email("Niepoprawny adres e-mail")
    .required("Adres e-mail jest wymagany"),
  password: yup
    .string()
    .required("Hasło jest wymagane")
    .min(6, "Minimum 6 znaków"),
});

export const CreateProfileSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Imię jest wymagane")
    .min(3, "Imię musi Posiadać co najmniej 3 znaki"),
  lastName: yup
    .string()
    .required("Nazwisko jest wymagane")
    .min(3, "Nazwisko musi posiadać conajmniej 3 znaki"),
  phone: yup
    .string()
    .required("Numer Telefonu jest wymagany")
    .matches(/^[0-9]{9}$/, "Numer telefonu musi mieć 9 cyfr"),
  teamCode: yup.string().required("Kod drużyny jest wymagany"),
});
