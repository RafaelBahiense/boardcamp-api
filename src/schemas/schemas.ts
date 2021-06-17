import Joi from "joi";

export const categorySchema = Joi.string().min(1).required().trim();

export const gameSchema = Joi.object({
  name: Joi.string().min(1).required().trim(),

  image: Joi.string().min(1).required().trim(),

  stockTotal: Joi.number().min(1).required(),

  categoryId: Joi.number().required(),

  pricePerDay: Joi.number().min(1).required(),
});
