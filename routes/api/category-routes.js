const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: { model: Product }
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: { model: Product }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  const categoryData = await Category.create(req.body);
  return res.json(categoryData);
});

router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (updated) {
      const updatedCategory = await Category.findByPk(req.params.id);
      return res.status(200).json(updatedCategory);
    }

    return res.status(404).json({ message: 'No category found with that id!' });
  } catch (err) {
    console.error('Error updating category:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.destroy({
      where: {
        category_id: req.params.id,
      },
    });

    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (categoryData) {
      return res.status(200).json({ message: 'Category deleted successfully' });
    }

    return res.status(404).json({ message: 'Category not found' });
  } catch (err) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});


module.exports = router;
