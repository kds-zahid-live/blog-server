const express = require('express');
const { db } = require('../firebaseConfig');
const router = express.Router();

// Helper function to generate slug
const generateSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Get All Posts (Ordered by latest)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get(); // Order by createdAt
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (err) {
    res.status(500).send('Error fetching posts');
  }
});

// Create a New Post
router.post('/', async (req, res) => {
  try {
    const { title, content, imageUrl, altText, imageHeight, imageWidth } = req.body;

    const slug = generateSlug(title); // Generate slug from title
    const newPost = {
      title,
      slug, // Add the slug field
      content,
      imageUrl, // Save the image URL
      altText,  // Save the alt text for the image
      imageHeight, // Save the height
      imageWidth, // Save the width
      createdAt: new Date(), // Add timestamp when creating the post
    };
    const docRef = await db.collection('posts').add(newPost);
    res.status(201).send({ id: docRef.id });
  } catch (err) {
    res.status(500).send('Error creating post');
  }
});

// Get a Single Post by ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('posts').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).send('Post not found');
    } else {
      res.json({ id: doc.id, ...doc.data() });
    }
  } catch (err) {
    res.status(500).send('Error fetching post');
  }
});
// Get a Single Post by Slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const snapshot = await db.collection('posts').where('slug', '==', slug).limit(1).get();

    if (snapshot.empty) {
      return res.status(404).send('Post not found');
    }

    const post = snapshot.docs[0].data();
    post.id = snapshot.docs[0].id; // Include the ID in the response

    res.json(post);
  } catch (err) {
    res.status(500).send('Error fetching post by slug');
  }
});



module.exports = router;
