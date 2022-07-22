import joi from "joi";

const gameSchema = joi.object({
  name: joi.string().required(),
  image: joi
    .string()
    .regex(/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/)
    .required(),
  stockTotal: joi.number().integer().min(1).required(),
  categoryId: joi.number().integer().required(),
  pricePerDay: joi.number().integer().min(1).required(),
});

export default gameSchema;
