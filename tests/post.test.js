const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Asegúrate de que exporta app
const Post = require('../models/Post');

// Aumentamos el timeout global para este archivo (Atlas es lento a veces)
jest.setTimeout(30000); // 30 segundos → más operaciones

let connection;

beforeAll(async () => {
  try {
    // Conectamos explícitamente aquí (usa la misma URI que en .env)
    connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a MongoDB establecida para tests');

    // Limpiamos la colección antes de empezar
    await Post.deleteMany({});
    console.log('Colección de Posts limpiada');
  } catch (err) {
    console.error('Error conectando/limpiando en beforeAll:', err);
    throw err; // Para que Jest marque el suite como fallido
  }
});

afterAll(async () => {
  if (connection) {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB después de tests');
  }
});

describe('POST /create', () => {
  it('debería crear una publicación válida', async () => {
    const res = await request(app)
      .post('/create')
      .send({
        title: 'Mi primer post de test',
        body: 'Contenido interesante para probar'
      })
      .expect(201);

    expect(res.body).toHaveProperty('post');
    expect(res.body.post.title).toBe('Mi primer post de test');
  });

  it('debería rechazar publicación sin título', async () => {
    const res = await request(app)
      .post('/create')
      .send({
        body: 'Solo cuerpo, debería fallar'
      })
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /', () => {
  it('debería devolver todas las publicaciones (array)', async () => {
    // Creamos un post de prueba primero
    await Post.create({
      title: 'Post de prueba para GET',
      body: 'Contenido visible'
    });

    const res = await request(app)
      .get('/')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});