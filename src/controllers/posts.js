const Post = require('../models/Post');
const Likes = require('../models/Likes');

async function getAllPosts(req, res) {
  const { author } = req.query;

  let posts
  try {
    if (author) posts = await Post.find({ author });
    else posts = await Post.find();
    const likes = await Likes.find({ post: { $in: posts.map(post => post._id) } });

    const postsWithLikes = posts.map(post => {
      const postLikes = likes.filter(like => like.post.toString() === post._id.toString());
      return { ...post._doc, likes: postLikes.length };
    });
    res.json({ posts: postsWithLikes });
  } catch (error) {
    res.status(500).json({ error: 'Error getting posts' });
  }
}

async function getPost(req, res) {
  const { post_id } = req.params;
  if (!post_id) return res.status(400).json({ error: 'Missing post_id' });

  try {
    const post = await Post.findById(post_id);
    const likes = await Likes.countDocuments({ post: post_id });
    res.json({ ...post._doc, likes });
  } catch (error) {
    res.status(500).json({ error: 'Invalid post_id' });
  }
}

async function createPost(req, res) {
  const { author, body } = req.body;
  if (!author || !body) return res.status(400).json({ error: 'Missing post data' });

  try {
    const post = await Post.create({ author, body });
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Invalid post data' });
  }
}

async function updatePost(req, res) {
  const { post_id } = req.params;
  const { body } = req.body;
  if (!post_id) return res.status(400).json({ error: 'Missing post_id' });
  if (!body) return res.status(400).json({ error: 'Missing post body' });

  try {
    const post = await Post.findByIdAndUpdate(post_id, { body }, { new: true });
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Invalid post_id or data' });
  }
}

async function deletePost(req, res) {
  const { post_id } = req.params;
  if (!post_id) return res.status(400).json({ error: 'Missing post_id' });

  try {
    const post = await Post.findByIdAndDelete(post_id);
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Invalid post_id' });
  }
}

module.exports = { getAllPosts, getPost, createPost, updatePost, deletePost };
