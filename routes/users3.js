const User = require('../models/User');
const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60*60*24 });


router.get('/', (req, res) => {
    //3. Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.
    const cacheKey = 'users3';
    const cachedUsers = cache.get(cacheKey);

    if (cachedUsers) {
        console.log('Retrieving users from cache');
        return res.send(cachedUsers);
    }
    
    User.find(
        {            
            last_name: /^M/,
            quote: { $exists: true, $regex: /^.{15,}$/ }
        }
    ).then((users, err) => {
        if(err){
            console.log(err);
            return res.status(500).send('Internal server error')
        }

        users = users.filter((user) => (
            user.email.includes(user.last_name.toLowerCase())
        ))
        
        cache.set(cacheKey, users);
        res.send(users);
    })
})

module.exports = router;