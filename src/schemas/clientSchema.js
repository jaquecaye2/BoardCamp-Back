import joi from "joi";
import dayjs from "dayjs";

const clientSchema = joi.object({
  name: joi.string().required(),
  phone: joi
    .string()
    .regex(/([0-9]{10}|[0-9]{11})/)
    .required(),
  cpf: joi
    .string()
    .regex(/[0-9]{11}/)
    .required(),
  birthday: joi.date().max(dayjs().format('YYYY-MM-DD')).required(),
});

export default clientSchema;
