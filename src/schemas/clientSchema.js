import joi from "joi";

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
  birthday: joi
    .string()
    .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
});

export default clientSchema;
