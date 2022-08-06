const express = require('express');
const moment = require('moment');
const axios = require('axios');
const url = require('url');

const searchPageSchema = require('../Models/SearchPage');
const searchTermSchema = require('../Models/SearchTerm');

const router = express.Router();

router.get('/search/:searchTerm', async(req, res) => {
    try {
        const searchTerm = req.params.searchTerm.toLowerCase().trim();
        let queryParams;

        if(typeof searchTerm === 'string' && searchTerm !== '') {
            queryParams = {
                origin: '*',
                format: 'json',
                action: 'query',
                prop: 'extracts',
                exsentences: 10,
                exintro: true,
                explaintext: true,
                generator: 'search',
                gsrlimit: 10,
                gsrsearch: searchTerm
            }

            const searchTermInDB = await searchTermSchema.find({searchTerm});

            if(searchTermInDB.length === 1) {
                searchTermInDB[0].totalQueries += 1;
                await searchTermInDB[0].save();
            } else if(!searchTermInDB.length) {
                const momentUTC = moment().utc();
                const dateNow = momentUTC.set('hour', momentUTC.hour() + 5).set('minute', momentUTC.minute() + 30);
                const newSearchTerm = new searchTermSchema({
                    searchTerm,
                    totalQueries: 1,
                    createdAt: {
                        date: dateNow.date(),
                        month: dateNow.month() + 1,
                        year: dateNow.year()
                    }
                });

                await newSearchTerm.save();
            } else {
                return res.status(400).json({message: 'Some error occured'});
            }

            const params = new url.URLSearchParams(queryParams);
            const result = await axios.get(`https://en.wikipedia.org/w/api.php?${params}`);
            const data = Object.values(result.data.query.pages);
            return res.status(200).json({data});
        } else {
            return res.status(400).json({message: 'Please enter the search term properly.'});
        }
    } catch(err) {
        return res.status(500).json({message: 'Some error occured. Please try again.'});
    }
});

router.get('/read/:slug/:title', async(req, res) => {
    try {
        const slug = parseInt(req.params.slug);
        const title = req.params.title.toLowerCase().trim();

        if(typeof slug === 'number' && typeof title === 'string' && title !== '') {
            const pageInDB = await searchPageSchema.find({pageid: slug});

            if(pageInDB.length === 1) {
                pageInDB[0].totalVisits += 1;
                await pageInDB[0].save();
            } else if(!pageInDB.length) {
                const newSearchPage = new searchPageSchema({
                    pageid: slug,
                    pageTitle: title,
                    wikipediaUrl: `https://en.wikipedia.org?curid=${slug}`,
                    totalVisits: 1
                });

                await newSearchPage.save();
            } else {
                return res.status(400).json({message: 'Some error occured'});
            }

            const result = await axios.get(`https://en.wikipedia.org?curid=${slug}`);
            return res.status(200).send(result.data);
        }

        
    } catch (err) {
        return res.status(500).json({message: 'Some error occured. Please try again.'});
    }
})

module.exports = router;