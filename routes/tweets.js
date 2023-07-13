var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets')
const { checkBody } = require('../modules/checkBody');


/* POST new tweet */
router.post('/addTweet', (req, res) => {
if (!checkBody(req.body, ['content'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
    }  

//gestion du hashtag
  let hashtag =[];
  if (req.body.hashtag) {
    hashtag.push(req.body.hashtag)
  }
  
// Créer un nouvel objet Tweet

  const newTweet = new Tweet({
    content : req.body.content,
    userId : req.body.userId ,
    timeStamp: new Date(),
    likes: 0,
    hashtags: hashtag,
    mentions: []
  });

  // Enregistrer le nouveau tweet en base de données
    newTweet.save().then((data) => {
    res.json({ result: true, data: data});
  });
  });

/* GET alltweets */
router.get("/", (req, res) => {
	Tweet.find().then(tweets => {
		res.json({ Tweets: tweets });
	});
});

/* DELETE tweet */

router.delete("/:id", (req, res) => {
    Tweet.deleteOne({_id : req.body.id})
    .then(() => {
          res.json({ result: true });
        });

});

/* Update like */


router.put("/like", (req, res) => {
  const tweetId = req.body.id;

  Tweet.findByIdAndUpdate(tweetId, { $inc: { likes: 1 } })
    .then((tweet) => {
      if (tweet) {
        res.json({ message: 'Tweet mis à jour avec succès.' });
      } else {
        res.status(404).json({ message: 'Tweet non trouvé.' });
      }
    })
});




  


module.exports = router;
