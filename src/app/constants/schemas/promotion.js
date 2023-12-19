import { VALIDATION_MESSAGES } from "../messagesPromotion";
import { object, string, number, date, ref } from 'yup';

export const registerPromotion = object({
  name: string().max(10, VALIDATION_MESSAGES.name).required(VALIDATION_MESSAGES.required),
  description: string().max(200, VALIDATION_MESSAGES.description).required(VALIDATION_MESSAGES.required),
  value: number().typeError(VALIDATION_MESSAGES.required).min(1, VALIDATION_MESSAGES.value),
  use_max: number().typeError(VALIDATION_MESSAGES.required).min(2, VALIDATION_MESSAGES.use_max).required(VALIDATION_MESSAGES.requiredNumber),
  code: string().max(10, VALIDATION_MESSAGES.code).required(VALIDATION_MESSAGES.required),
});