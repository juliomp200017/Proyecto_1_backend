const router = require('express').Router();
const {
  getFollows,
  createFollow,
  deleteFollow,
} = require('../controllers/follows');

router.get('/:user_id', getFollows);
router.post('/', createFollow);
router.delete('/', deleteFollow);

module.exports = router;
