const User = require('../models/User');
const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60*60*24 });

router.get('/', (req, res) => {
    //2. Male Users which have phone price greater than 10,000.
    const cacheKey = 'users2';
    const cachedUsers = cache.get(cacheKey);

    if (cachedUsers) {
        console.log('Retrieving users from cache');
        return res.send(cachedUsers);
    }
    User.find(
        {
            gender: 'Male',
            $expr: { $gt: [{ $toInt: "$phone_price" }, 10000] },
        }
    ).then((users, err) => {
        if(err){
            console.log(err);
            return res.status(500).send('Internal server error')
        }
        cache.set(cacheKey, users);
        res.send(users);
    })
})


module.exports = router;