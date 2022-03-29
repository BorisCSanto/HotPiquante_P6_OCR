
const User = require('../models/user')
const Sauce = require('../models/sauce')
const url = 'mongodb://localhost:27017/hotpiquante';

exports.getAll = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => {
            console.log(error)
            res.status(400).json({ error })
        })
}