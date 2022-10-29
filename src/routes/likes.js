const router = require('express').Router();
const {
  getLikes,
  createLike,
  deleteLike,
} = require('../controllers/likes');

router.get('/:user_id', getLikes);
router.post('/', createLike);
router.delete('/', deleteLike);

module.exports = router;
