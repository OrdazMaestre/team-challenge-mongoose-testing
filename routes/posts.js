const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// POST /create - Crear publicación (con validación)
router.post('/create', async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: title y body son requeridos'
      });
    }

    const post = new Post({ title, body });
    await post.save();

    res.status(201).json({
      message: 'Publicación creada correctamente',
      post
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET / - Todas las publicaciones
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /id/:_id
router.get('/id/:_id', async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /title/:title
router.get('/title/:title', async (req, res) => {
  try {
    const post = await Post.findOne({ title: req.params.title });
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /id/:_id
router.put('/id/:_id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json({ message: 'Publicación actualizada', post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /id/:_id
router.delete('/id/:_id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params._id);
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EXTRA - Paginación simple (10 por página)
router.get('/postsWithPagination', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      posts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;