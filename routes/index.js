const express = require('express');
const { getMyPosts, searchByHashtag } = require('../controllers');

const router = express.Router();

// POST /mypostss
router.get('/myposts', getMyPosts);

// POST /search/:hashtag
router.get('/search/:hashtag', searchByHashtag);

module.exports = router;