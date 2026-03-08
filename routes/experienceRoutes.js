const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken.js');
const {
  index,
  show,
  create,
  update,
  destroy
} = require('../controllers/experienceController');

router.use(verifyToken);

router.get('/:id', show);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
