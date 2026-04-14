'use server';

import { simulateDelay } from "@/utils/async-delay";


export async function logoutAction() {
  await simulateDelay(5000); // Vou manter
}