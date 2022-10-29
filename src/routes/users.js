const router = require('express').Router();
const {
  getUser,
  getAllUsers,
  getUserTimeline,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:user_id', getUser);
router.get('/:user_id/timeline', getUserTimeline);

router.post('/', createUser);
router.put('/:user_id', updateUser);
router.delete('/:user_id', deleteUser);


module.exports = router;
