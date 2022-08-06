const express = require('express');
const Auth = require('../Auth/Auth');

const searchTermSchema = require('../Models/SearchTerm');

const router = express.Router();

router.get('/analytics/searchTerms/:sorting', Auth, async(req, res) => {
    try {
        const {sorting} = req.params;

        let searchedTerms = [];
        if(sorting === 'asc') {
            searchedTerms = await searchTermSchema.find().sort({totalQueries: 1})
        } else if(sorting === 'desc') {
            searchedTerms = await searchTermSchema.find().sort({totalQueries: -1});
        } else {
            return res.status(400).json({message: 'Some error occured. Please try again.'});
        }
        
        return res.status(200).json({payload: searchedTerms});2
    } catch(err) {
        return res.status(500).json({message: 'Some error occured.'});
    }
});

module.exports = router;