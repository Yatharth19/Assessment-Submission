const express = require('express');
const router = express.Router();
const User = require('../models/User');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60*60*24 });


router.get('/', (req, res) => {
    //4. Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
    const cacheKey = 'users4';
    const cachedUsers = cache.get(cacheKey);

    if(cachedUsers) {
        console.log('Retrieving users from cache');
        return res.send(cachedUsers);
    }

    User.find(
        {
            car: {$in: ['BMW', 'Mercedes-Benz', 'Audi']},
            email: {$not: /\d/}
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