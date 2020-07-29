const User = require('../models/user');
const viewPath = 'users';

exports.new = (req,res) => {
    res.render(`${viewPath}/new`, {
        pageTitle: 'New User'
    });
};

exports.create = async (req,res) => {
   try{
        //just a new user is created, 
        const user = new User(req.body);
        //then lets register user using password, here passport library will automatically generate password field
        //.register is built in passport library's function
        await User.register(user, req.body.password);
        req.flash('success', `Welcome, ${user.fullname}. Thank you for registering.`);
        res.redirect('/'); 
    }catch (error){
        console.log(error.message);
        req.flash('danger', error.message);
        req.session.formData = req.body;
        res.redirect(`/register`);
    }
};