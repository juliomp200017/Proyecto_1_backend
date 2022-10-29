const Likes = require('../models/Likes');

async function getLikes(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const likes = await Likes.find({ user: user_id }).populate('post');
    const postsLikeCount = await Promise.all(likes.map(async like => {
      const likeCount = await Likes.countDocuments({ post: like.post._id });
      return { ...like.post._doc, likes: likeCount };
    }));
    res.json({ posts: postsLikeCount });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }
}

async function createLike(req, res) {
  const { user, post } = req.body;
  if (!user || !post) return res.status(400).json({ error: 'Missing like data' });

  const liked = await Likes.findOne({ user, post });
  if (liked) return res.status(400).json({ error: 'User already liked Post' });

  try {
    const like = await Likes.create({ user, post });
    res.json({ like });
  } catch (error) {
    res.status(500).json({ error: 'Invalid like data' });
  }
}

async function deleteLike(req, res) {
  const { user_id, post_id } = req.query;
  if (!user_id || !post_id) return res.status(400).json({ error: 'Missing like data' });

  try {
    const like = await Likes.findOneAndDelete({ user: user_id, post: post_id });
    res.json({ like });
  } catch (error) {
    res.status(500).json({ error: 'Invalid like data' });
  }
}

module.exports = { getLikes, createLike, deleteLike };
