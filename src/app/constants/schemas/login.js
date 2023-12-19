import { VALIDATION_MESSAGES } from "../message";
import { object, string, ref } from 'yup';

export const loginSchema = object({
    email: string().required(VALIDATION_MESSAGES.email),
    password: string().required(VALIDATION_MESSAGES.password),
});