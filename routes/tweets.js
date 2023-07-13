var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets')


/* POST new tweet */
router.post('/addTweet', (req, res) => {
if (!checkBody(req.body, ['content'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
    }  
  // Créer un nouvel objet Tweet
  const newTweet = new Tweet({
    content,
    user,
    timestamp: new Date(),
    likes: 0,
    hashtags: [],
    mentions: []
  });

  // Enregistrer le nouveau tweet en base de données
    newTweet.save().then(data => {
    res.json({ result: true});
  });
  });

/* GET alltweets */
router.get("/", (req, res) => {
	Tweet.find().then(tweets => {
		res.json({ Tweets: tweets });
	});
});


module.exports = router;
