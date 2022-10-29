const User = require('../models/User');
const Follow = require('../models/Follow');
const Post = require('../models/Post');
const Likes = require('../models/Likes');

async function getAllUsers(_, res) {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error getting users' });
  }
}

async function getUser(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findById(user_id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }
}

async function getUserTimeline(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const follows = await Follow.find({ follower: user_id });
    const posts = await Post.find({ author: { $in: follows.map(follow => follow.followed) } });
    const likes = await Likes.find({ post: { $in: posts.map(post => post._id) } });

    const timeline = posts.map(post => {
      const postLikes = likes.filter(like => like.post.toString() === post._id.toString());
      return {
        ...post._doc,
        likes: postLikes.length,
      };
    });
    res.json({ posts: timeline });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }
}

async function createUser(req, res) {
  const { username, email, password, birthdate } = req.body;
  if (!username || !email || !password || !birthdate) return res.status(400).json({ error: 'Missing user data' });

  const byEmail = await User.findOne({ email });
  if (byEmail) return res.status(400).json({ error: 'Email already in use' });

  const byUsername = await User.findOne({ username });
  if (byUsername) return res.status(400).json({ error: 'Username already in use' });

  try {
    const user = await User.create({ username, email, password, birthdate });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user data' });
  }
}

async function updateUser(req, res) {
  const { user_id } = req.params;
  const { username, email, password, birthdate } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  if (!username && !email && !password && !birthdate) return res.status(400).json({ error: 'Missing user data' });

  try {
    const user = await User.findById(user_id);
    const data = {
      username: username || user.username,
      email: email || user.email,
      password: password || user.password,
      birthdate: birthdate || user.birthdate
    }
    const updatedUser = await User.findByIdAndUpdate(user_id, data, { new: true });
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id or data' });
  }
}

async function deleteUser(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findByIdAndDelete(user_id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }
}

module.exports = { getAllUsers, getUser, getUserTimeline, createUser, updateUser, deleteUser };
