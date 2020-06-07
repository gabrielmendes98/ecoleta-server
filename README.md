# Ecoleta REST API

This is the API for the Ecoleta project developed during Rocketseat's Next Level Week.

This Api uses sqlite3 as a database. Multer as middleware for handling multipart / form-data to allow us to upload files. Knex to make the connection to the database, so that we can use different databases and even then it will continue to work. Express to facilitate the creation of the server and routes. And Celebrate to validate the data received by the API.

`Content-Type: multipart/form-data`

## Install

    npm install

## Create the tables

    npm run knex:migrate

## Create the items table (predefined images)

    npm run knex:seed

## Run the app

    npm run dev

# REST API

The REST API to the app is described below.

## Get list of Items

### Request

`GET /item`

### Success Response:

- Code: 200

- Content:
  `[ { "id": 1, "title": "Lampadas", "image_url": "http://localhost:3333/uploads/lampadas.svg" }, ... ]`

## Get single point

### Request

`GET /points/:id`

### Success Response:

- Code: 200

- Content:
  `{ "point": { "id": 2, "image": "72246137fcec-mercadao.png", "name": "Mercadao", "email": "mercadao@gmail.com", "whatsapp": "123456789", "latitude": -18.8973251, "longitude": -48.2256671, "city": "Uberlândia", "uf": "MG", "image_url": "http://localhost:3333/uploads/72246137fcec-mercadao.png" }, "items": [ { "title": "Residuos Eletronicos" }, ... ] }`

## Get list of filtered points - by city, uf and items that it collects.

### Request

`GET /points?uf=MG&city=Uberl%C3%A2ndia&items=1,2,4`

### Success Response:

- Code: 200

- Content:
  `[ { "id": 2, "image": "45a820cc2e6b-market.png", "name": "Mercado do Jose", "email": "jose@gmail.com", "whatsapp": "123456789", "latitude": -18.8973251, "longitude": -48.2256671, "city": "Uberlândia", "uf": "MG", "image_url": "http://localhost:3333/uploads/45a820cc2e6b-market.png" }, ... ]`

## Create new collect point

### Request

`POST /points`

- request.body: `{ name: 'Mercado do Jose', email: 'jose@gmail.com', whatsapp: 123456789, latitude: -18.8973251, longitude: -48.2256671, city: 'Uberlândia', uf: 'MG', items: '4,5' }`

- request.file: `the file that user uploads in the frontend`

### Success Response:

- Code: 200

- Content:
  `{ "id": 6, "image": "7a25d9137f9d-market.png", "name": "Mercado do Jose", "email": "jose@gmail.com", "whatsapp": 123456789, "latitude": -18.8973251, "longitude": -48.2256671, "city": "Uberlândia", "uf": "MG" }`

## Delete collect point

### Request

`DELETE /points/5`

### Success Response:

- Code: 200

- Content:
  `{ "message": "deleted" }`

### Error Response:

- Code: 404

- Content:
  `{ "message": "point not found" }`

## Update collect point

### Request

`PUT /points/2`

- request.body example (there may be more fields): `{ name: 'Mercado do Jose 23' }`

- request.file: `the file that user uploads in the frontend`

### Success Response:

- Code: 200

- Content:
  `{ "id": "2", "name": "Mercado do Jose 23", "image": "72246137fcec-market.png" }`
