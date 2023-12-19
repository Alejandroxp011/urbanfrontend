import { VALIDATION_MESSAGES } from "../message";
import { object, string, ref } from 'yup';
  
export const recoverSchema = object({
    email: string().email(VALIDATION_MESSAGES.email)
});