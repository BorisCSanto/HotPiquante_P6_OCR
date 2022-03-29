const express = require('express')
const MongoClient = require('mongoose');
const url = 'mongodb://localhost:27017/hotpiquante';

MongoClient.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connexion à MongoDB réussie !')
    })
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const path = require('path');

const authRoutes = require('./routes/auth');
const saucesRoutes = require('./routes/sauces');
const Sauce = require('./models/sauce')

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRoutes)
// app.use('/api/sauces/:id', (req, res, next) => {
//     Sauce.findOne({ _id: req.params.id })
//         .then(sauce => {
//             if (!sauce) {
//                 return res.status(404).json({ error: "Sauce inconnue !!" })
//             }
//             res.status(200).json(sauce)
//         })
//         .catch(error => {
//             console.log(error)
//             res.status(404).json({ error })
//         })
// })
app.use('/api/sauces', saucesRoutes)



module.exports = app