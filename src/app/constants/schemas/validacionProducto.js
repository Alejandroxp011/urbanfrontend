import { VALIDATION_MESSAGES } from "../messages";

import { object, string, number,mixed} from 'yup';

export const registroProducto = object().shape({
    name: string().matches(/^[a-zA-Z\s]+$/,VALIDATION_MESSAGES.name).required(VALIDATION_MESSAGES.required),
    code: string(),
    description : string().required(VALIDATION_MESSAGES.required),
    price: number(VALIDATION_MESSAGES.numero).positive(VALIDATION_MESSAGES.positivo).required(VALIDATION_MESSAGES.required),
    stock: number(VALIDATION_MESSAGES.numero).integer(VALIDATION_MESSAGES.entero).positive(VALIDATION_MESSAGES.positivo).required(VALIDATION_MESSAGES.required),
    brand: string().required(VALIDATION_MESSAGES.required),
    provider : string(),
    category_id: number().positive(VALIDATION_MESSAGES.positivo).required(VALIDATION_MESSAGES.required),
    image : mixed().test('fileType', 'La imagen debe ser un archivo JPG', (value) => {
        if (!value) return true;
        return value && value.type === 'image/jpg';
      }).required(VALIDATION_MESSAGES.required)
});  
export const edicionProducto = object().shape({
  name: string().matches(/^[a-zA-Z\s]+$/,VALIDATION_MESSAGES.name).required(VALIDATION_MESSAGES.required),
  code: string(),
  description : string().required(VALIDATION_MESSAGES.required),
  price: number(VALIDATION_MESSAGES.numero).positive(VALIDATION_MESSAGES.positivo).required(VALIDATION_MESSAGES.required),
  stock: number(VALIDATION_MESSAGES.numero).integer(VALIDATION_MESSAGES.entero).positive(VALIDATION_MESSAGES.positivo).required(VALIDATION_MESSAGES.required),
  brand: string().required(VALIDATION_MESSAGES.required),
  provider : string(),
  category_id: number().positive(VALIDATION_MESSAGES.positivo).required(VALIDATION_MESSAGES.required),
  image : mixed().test('fileType', 'La imagen debe ser un archivo JPG', (value) => {
      if (!value) return true;
      return value && value.type === 'image/jpg';
    }).required(VALIDATION_MESSAGES.required)
}); 