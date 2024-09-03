const router = require('express').Router();
const Post = require('../models/post');

// Route to get all posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find({}, { title: true }).exec();
    res.render('index', { posts });
  } catch (err) {
    next(err); // Handle errors
  }
});

// Route to get a specific post by ID
router.get('/posts/:id', async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).exec();
    res.render('post', { post });
  } catch (err) {
    next(err); // Handle errors
  }
});

router.put('/posts/:id', async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { body: req.body.body },
      { new: true }
    );

    if (!post) {
      return res.status(404).send('Post not found');
    }

    let Pusher = require('pusher');
    let pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.PUSHER_APP_CLUSTER,
    });

    pusher.trigger(
      'notifications',
      'post_updated',
      post,
      req.headers['x-socket-id']
    );

    res.send('');
  } catch (err) {
    // Log and handle errors
    console.error('Error updating post:', err);
    next(err);
  }
});

module.exports = router;
