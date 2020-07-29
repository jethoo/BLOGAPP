const { new: _new,index,show,create,edit,update,delete: _delete} = require('../controllers/BlogsController');

function auth (req,res,next) {
    if(!req.isAuthenticated()){
        req.flash('danger', 'You need to login first');
        return res.redirect('/login');
    }
    next();
}

module.exports = router => {
    router.get('/blogs', index); //public
    router.get('/blogs/new', auth, _new); //authenticated
    router.post('/blogs', auth, create); //authenticated
    router.post('/blogs/update', auth, update); //authenticated
    router.post('/blogs/delete', auth, _delete); //authenticated
    router.get('/blogs/:id/edit', auth, edit); //authenticated
    router.get('/blogs/:id', show); //public
};
