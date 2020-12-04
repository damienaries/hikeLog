const mongoose = require('mongoose');
const Hike = require('../models/hike');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/hike-log', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database Connected!');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Hike.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 15);
        const hike = new Hike({
            author: '5fc2dd654b9aef543d2dd86c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/hike-log/image/upload/v1606799796/HikeLog/pmmgpwdtcdclmjyvm4uu.jpg',
                  filename: 'HikeLog/pmmgpwdtcdclmjyvm4uu'
                },
                {
                  url: 'https://res.cloudinary.com/hike-log/image/upload/v1606799797/HikeLog/dfrozxn7vuthzynvq3wd.jpg',
                  filename: 'HikeLog/dfrozxn7vuthzynvq3wd'
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex aperiam tempore ad debitis dicta nihil expedita quis ipsam ab sapiente!',
            price: price
        })
    await hike.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});