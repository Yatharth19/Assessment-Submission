const express = require('express');
const router = express.Router();
const User = require('../models/User')
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60*60*24 });

router.get('/', (req, res) => {
  // 1. Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.

  const cacheKey = 'users1';
  const cachedUsers = cache.get(cacheKey);
    User.find(
      { 
        income: { $lt: 5 }, 
        car: { $in: ['BMW', 'Mercedes-Benz'] }
      }
    ).then((users, err) => {
      if(err){
        console.log(err);
        return res.status(500).send('Internal server error')
      }
        cache.set(cacheKey, users);
        res.send(users);
      });
});

module.exports = router;