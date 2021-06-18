import Joi from "joi";

export const categorySchema = Joi.string().min(1).required().trim();

export const gameSchema = Joi.object({
  name: Joi.string().min(1).required().trim(),

  image: Joi.string().min(1).required().trim(),

  stockTotal: Joi.number().min(1).required(),

  categoryId: Joi.number().min(0).required(),

  pricePerDay: Joi.number().min(1).required(),
});

export const customersSchema = Joi.object({
    name: Joi.string().min(1).required().trim(),

    phone: Joi.string().min(10).max(11).regex(/^[0-9]+$/).required().trim(), 
    
    cpf: Joi.string().length(11).regex(/^[0-9]+$/).required().trim(),

    birthday: Joi.date().required()
})

export const rentalSchema = Joi.object({
  customerId: Joi.number().min(0).required(),

  gameId: Joi.number().min(0).required(),

  daysRented: Joi.number().min(1).required(),

  rentDate: Joi.date().required(),
  
  returnDate: Joi.alternatives().try(Joi.date().required(),null),
  
  delayFee: Joi.alternatives().try(Joi.number().min(0).required(),null),

  originalPrice: Joi.alternatives().try(Joi.number().min(0).required(),null),
})