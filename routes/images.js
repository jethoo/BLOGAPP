const {new:_new, index, create } = require('../controllers/ImagesController');

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
});

module.exports = router => {
    router.get('/images', index);
    router.get('/images/new', _new);
    //the name is image inside , upload.single('image') is the name which we use in the form, input type name
    router.post('/images', upload.single('image'), create);
};


