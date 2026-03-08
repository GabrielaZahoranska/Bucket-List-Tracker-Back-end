const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken.js');
const {
  index,
  show,
  create,
  update,
  destroy,
  stats
} = require('../controllers/bucketItemController');
const experienceController = require('../controllers/experienceController');

router.use(verifyToken);

router.get('/stats', stats);
router.get('/', index);
router.post('/', create);
router.get('/:bucketItemId/experiences', experienceController.index);
router.post('/:bucketItemId/experiences', experienceController.create);
router.get('/:id', show);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
