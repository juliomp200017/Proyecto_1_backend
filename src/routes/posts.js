const router = require('express').Router();
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/posts');

router.get('/', getAllPosts);
router.get('/:post_id', getPost);
router.post('/', createPost);
router.put('/:post_id', updatePost);
router.delete('/:post_id', deletePost);

module.exports = router;
