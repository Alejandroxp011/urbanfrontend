import { VALIDATION_MESSAGES } from "../mensages";
import { object, string, ref, number } from 'yup';

export const validacionCampos = object().shape({
    buying_price: number(VALIDATION_MESSAGES.numero).positive(VALIDATION_MESSAGES.positivo).required(VALIDATION_MESSAGES.required),
    buying_amount:number(VALIDATION_MESSAGES.numero).positive(VALIDATION_MESSAGES.positivo).required(VALIDATION_MESSAGES.required)
});