import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `${process.env.IMAGE_UPLOAD_URL}/uploads/${point.image}`,
      };
    });

    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();
    console.log(point);

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const serializedPoint = {
      ...point,
      image_url: `${process.env.IMAGE_UPLOAD_URL}/uploads/${point.image}`,
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')
      .select('items.id');

    return response.json({ point: serializedPoint, items });
  }

  async create(request: Request, response: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({ id: point_id, ...point });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const res = await knex('points').where({ id }).del();

    return res === 1
      ? response.json({ message: 'deleted' })
      : response.status(404).json({ message: 'point not found' });
  }

  async update(request: Request, response: Response) {
    const point_id = request.params.id;

    const { items, ...point } = request.body;

    if (request.file) {
      if (request.file.filename) {
        point.image = request.file.filename;
      }
    }

    const trx = await knex.transaction();

    await trx('points').where({ id: point_id }).update(point);

    if (items) {
      const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
          return {
            item_id,
            point_id,
          };
        });

      await trx('point_items').where({ point_id }).del();

      await trx('point_items').insert(pointItems);
    }

    await trx.commit();

    return response.json({ id: point_id, ...point });
  }
}

export default PointsController;
