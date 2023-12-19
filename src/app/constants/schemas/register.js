import { VALIDATION_MESSAGES } from "../messages";
import { object, string, ref } from 'yup';

export const registerSchema = object({
    name: string().required(VALIDATION_MESSAGES.required),
    email: string().email(VALIDATION_MESSAGES.email).required(VALIDATION_MESSAGES.required),
    password: string().min(8, VALIDATION_MESSAGES.password).required(VALIDATION_MESSAGES.required),
    repeatPassword: string().oneOf([ref('password')], VALIDATION_MESSAGES.repeatPassword).required(VALIDATION_MESSAGES.required),
});