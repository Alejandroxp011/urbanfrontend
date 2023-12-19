import { VALIDATION_MESSAGES } from "../messages";
import { object, string } from 'yup';

export const registerCategory = object().shape({
    name: string().matches(/^[a-zA-Z\s]+$/,VALIDATION_MESSAGES.name).required(VALIDATION_MESSAGES.required),
    detail: string().matches(/^[a-zA-Z0-9\s_-]+$/,VALIDATION_MESSAGES.name).required(VALIDATION_MESSAGES.required),
});