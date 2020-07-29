//For uploading the image, we will use the following concept
// We have to take the image the user uploads, convert it to base-64 format
//And store it into the database
//Using base-64 is the way, because html supports base-64 format
 //Step 1: Install Multer library. npm-install-multer. Because node does not support multi-part-form data out of the box
 //So, we need third party library such as multer
 //Step 2:Create a model named image.js

 const Image = require('../models/image');
 const viewPath = 'images';

 exports.index = async (req,res) => {
    const images = await Image.find();

    res.render(`${viewPath}`, {
        pageTitle: 'Images',
        images: images
    });
 };

 exports.new = async (req,res) => {
     res.render(`${viewPath}/new`, {
        pageTitle: 'New Image'
     });
 };

 exports.create = async (req,res) => {
    //console.log(req.body, req.file);
    //lets convert the binary structure of the uploded image file into base64
    const encoded = req.file.buffer.toString('base64');
    await Image.create({
        fileName: req.file.originalname,
        data: encoded,
        mimeType: req.file.mimetype
    });
    res.redirect('/images');
 };
 
