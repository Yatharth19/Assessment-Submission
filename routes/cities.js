const express = require('express');
const router = express.Router();
const User = require('../models/User');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60*60*24 });

router.get('/', (req, res) => {
    //5. Show the data of top 10 cities which have the highest number of users and their average income.
    const cacheKey = 'cities';
    const cachedCitites = cache.get(cacheKey);

    if(cachedCitites) {
        console.log('Retrieving Citites from cache');
        return res.send(cachedCitites);
    }

    User.aggregate(
        [
            { $group: { _id: '$city', total_income: { $sum:'$income' }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, city: '$_id', avg_income: { $divide: ['$total_income', '$count'] } } }
        ]
      ).then((cities, err) => {
        if(err){
            console.log(err); 
            return res.status(500).send('Internal server error')
        }
        cache.set(cacheKey, cities);
        res.send(cities);
    })
})



module.exports = router;