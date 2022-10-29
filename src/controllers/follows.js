const Follow = require('../models/Follow');

async function getFollows(req, res) {
  const { user_id } = req.params;
  const { filter } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  if (!filter) return res.status(400).json({ error: 'Missing filter' });

  if (filter === 'followers') return getFollowers(req, res);
  else if(filter === 'followed') return getFollowed(req, res);
  else return res.status(400).json({ error: 'Invalid filter' });
}

async function getFollowers(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const follows = await Follow.find({ followed: user_id }).populate('follower');
    res.json({ followers: follows.map(follow => follow.follower) });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }
}

async function getFollowed(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const follows = await Follow.find({ follower: user_id }).populate('followed');
    res.json({ followed: follows.map(follow => follow.followed) });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }
}

async function createFollow(req, res) {
  const { follower, followed } = req.body;
  if (!follower || !followed) return res.status(400).json({ error: 'Missing follow data' });

  const follow = await Follow.findOne({ follower, followed });
  if (follow) return res.status(400).json({ error: 'Follower already follows Followed' });

  try {
    const follow = await Follow.create({ follower, followed });
    res.json({ follow });
  } catch (error) {
    res.status(500).json({ error: 'Invalid follow data' });
  }
}

async function deleteFollow(req, res) {
  const { follower, followed } = req.query;
  if (!follower || !followed) return res.status(400).json({ error: 'Missing follow data' });

  try {
    const follow = await Follow.findOneAndDelete({ follower, followed });
    res.json({ follow });
  } catch (error) {
    res.status(500).json({ error: 'Invalid follow data' });
  }
}

module.exports = { getFollows, createFollow, deleteFollow }
