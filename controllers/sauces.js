const { json } = require('express')
const fs = require('fs')
const Sauce = require('../models/sauce')

exports.getAll = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => {
            console.log(error)
            res.status(400).json({ error })
        })
}

exports.getOne = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ error: "Sauce inconnue !!" })
            }
            res.status(200).json(sauce)
        })
        .catch(error => {
            console.log(error)
            res.status(404).json({ error })
        })
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    let update
    if (req.file) {
        const imgUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        update = JSON.parse(req.body.sauce)
        update.imageUrl = imgUrl
    }
    else {
        update = req.body
    }
    Sauce.findOneAndUpdate({ _id: req.params.id }, {
        ...update
    })
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ error: "Sauce inconnue !!" })
            }
            if (req.file) {
                const image = sauce.imageUrl.split('/')
                const oldImage = "images/" + image[4]
                fs.unlink(oldImage, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
            sauce.save()
                .then(() => res.status(201).json({ message: 'Sauce modifiée !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => {
            console.log(error)
            res.status(404).json({ error })
        })
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const image = sauce.imageUrl.split('/')
            const oldImage = "images/" + image[4]
            fs.unlink(oldImage, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({ error })
        })
    Sauce.findOneAndDelete({ _id: req.params.id })
        .then(() => res.status(201).json({ message: 'Sauce effacée !' }))
        .catch(error => res.status(400).json({ error }))
}