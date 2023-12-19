import { VERIFICATION_MESSAGES } from "../verificationMessages";
import { object, string, matches } from 'yup';

export const verifyCodeSchema = object({
    verificationCode: string().required(VERIFICATION_MESSAGES.required).min(7,VERIFICATION_MESSAGES.number).matches(/^[0-9]{7}$/, VERIFICATION_MESSAGES.number),
});