"use server";

import { simulateDelay } from "@/utils/async-delay";

type loginActionState = {
  userName: string;
  error: string;
};

export async function loginAction(state: loginActionState, formData: FormData) {
  await simulateDelay(5000);

  if (!(formData instanceof FormData)) {
    return {
      userName: "",
      error: "Dados inválidos",
    };
  }

  const userName = formData.get("userName")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const isUserNameValid = userName === process.env.LOGIN_USER;
  const isPasswordValid = "";

  return {
    userName: "",
    error: "Teste error",
  };
}
