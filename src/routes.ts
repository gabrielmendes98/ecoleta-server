import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post(
  '/points',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string()
          .required()
          .regex(/^[0-9, ]*[0-9]$/),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  pointsController.create
);

routes.delete('/points/:id', pointsController.delete);

routes.put(
  '/points/:id',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email(),
        whatsapp: Joi.number(),
        latitude: Joi.number(),
        longitude: Joi.number(),
        city: Joi.string(),
        uf: Joi.string().max(2),
        items: Joi.string().regex(/^[0-9, ]*[0-9]$/),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  pointsController.update
);

export default routes;
