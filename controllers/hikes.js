const Hike = require('../models/hike');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const hikes = await Hike.find({});
    res.render('hikes/index', { hikes });
}

module.exports.renderNewForm = (req, res) => {
    res.render('hikes/new');
}

module.exports.createHike = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({ 
        query: req.body.hike.location,
        limit: 1
    }).send();
    const hike = new Hike(req.body.hike);
    hike.geometry = geoData.body.features[0].geometry;
    hike.images = req.files.map(f => ({
        url: f.path, 
        filename: f.filename
    }));
    hike.author = req.user._id;
    await hike.save();
    console.log(hike);
    req.flash('success', 'Thanks! You successfully posted a new Hike.');
    res.redirect(`/hikes/${hike._id}`);
}

module.exports.showHike = async (req, res) => {
    const hike = await Hike.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); 
    if (!hike) {
        req.flash('error', 'Cannot find Hike');
        res.redirect('/hikes');
    }
    res.render('hikes/show', { hike });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const hike = await Hike.findById(id);
    if (!hike) {
        req.flash('error', 'Cannot find Hike');
        res.redirect('/hikes');
    }
    res.render('hikes/edit', { hike });
}

module.exports.updateHike = async (req, res) => {
    const { id } = req.params;
    const hike = await Hike.findByIdAndUpdate(id, { ...req.body.hike });
    const imgs = req.files.map(f => ({
        url: f.path, 
        filename: f.filename
    }));
    hike.images.push(...imgs);
    await hike.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await hike.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
    }
    req.flash('success', 'Update Successful');
    res.redirect(`/hikes/${hike._id}`);
}

module.exports.deleteHike = async (req, res) => {
    const { id } = req.params;
    await Hike.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted this hike.');
    res.redirect('/hikes');
}