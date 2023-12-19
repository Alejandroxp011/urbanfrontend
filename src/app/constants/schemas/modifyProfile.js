import { VALIDATION_MESSAGES } from '../message';
import { object, string, ref } from 'yup';

export const modifyProfileSchema = object({
    name: string().required(VALIDATION_MESSAGES.required),
    email: string().email(VALIDATION_MESSAGES.email).required(VALIDATION_MESSAGES.required),
    city: string().matches(/^[A-Za-z]+$/, VALIDATION_MESSAGES.city),
    address: string(),
    phone: string()
        .matches(/^\d{8}$/, VALIDATION_MESSAGES.phone)
});