var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets')
const { checkBody } = require('../modules/checkBody');


/* POST new tweet */
router.post('/addTweet', (req, res) => {
if (!checkBody(req.body, ['content'])) {
    res.json({ result: false, error: 'Empty message' });
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
    newTweet
      .save()
      .then(() => {
        Tweet.find().populate("userId").then((data) => res.json({ result: true, data: data}))
  });

  });

/* GET alltweets */
router.get("/", (req, res) => {
	Tweet.find()
  .populate('userId')
  .then(tweets => {
		res.json({ result: true, tweets: tweets });
	});
});

/* GET alltweets from hashtag */
router.get("/hashtags/:hashtag", (req, res) => {
    const hashtag = req.params.hashtag;
  
    Tweet.find({ hashtags: { $in: [hashtag] } })
      .populate ('userId')
      .then((tweets) => {
        res.json({ tweets });
      })
      .catch((error) => {
        console.error('Erreur lors de la recherche des tweets par hashtag:', error);
        res.status(500).json({ message: 'Erreur lors de la recherche des tweets par hashtag.' });
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
