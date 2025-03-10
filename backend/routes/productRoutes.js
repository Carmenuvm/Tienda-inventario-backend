const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Aplicar el middleware de autenticación a todas las rutas de productos
router.use(authMiddleware);


// Obtener todas las categorías únicas
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('categoria');
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los productos (solo mostrar productos con existencia > 0)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ cantidad: { $gt: 0 } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para crear un producto con carga de imagen
router.post('/', isAdmin, upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, cantidad, categoria } = req.body;
  const imagen = req.file ? req.file.buffer : null; // Leer el buffer de la imagen

  try {
    const product = await Product.create({ nombre, descripcion, precio, cantidad, imagen, categoria });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto', error: error.message });
  }
});

// Actualizar un producto (requiere ser admin)
router.put('/:id', isAdmin, upload.single('imagen'), async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un producto (requiere ser admin)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(204).send(); // Respuesta sin contenido
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto.' });
  }
});

module.exports = router;