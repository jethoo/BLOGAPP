
const viewPath = ('blogs');
const Blog = require('../models/blog');
const User = require('../models/user');

exports.index = async (req,res) => {
    try{
        const blogs = await Blog
        .find()
        .populate('user')
        .sort({updatedAt: 'desc'});
        console.log(blogs);
        res.render(`${viewPath}/index`, {
            pageTitle: 'Archive',
            blogs: blogs
        });
    } catch (error){
        req.flash('danger', `There was an error displaying the archive: ${error}`);
        res.redirect('/');
    }
};

exports.show = async (req,res) => {
    try{
        const blog = await Blog.findById(req.params.id)
           .populate('user'); //name of the model , 'user' is passed in populate
        //need to populate the user , to check the user is part of it
        console.log(blog);
        res.render(`${viewPath}/show`, {
            pageTitle: blog.title,
            blog: blog
        });
    } catch (error){
        req.flash('danger', `There was an error displaying this 
        blog: ${error}`);
        res.redirect('/');
    }
};

exports.new = (req,res) => {
    res.render(`${viewPath}/new`, {
        pageTitle: 'New Blog'
    });
};

//async, await are the modern way to handle callbacks
    exports.create = async (req,res) => {
        console.log(`Blog body: ${JSON.stringify(req.body, null, 2)}`);
        
        //90 % of time I/O are asynchronous
        try {
            //3 steps for connecting logged in user to blog he/she is writing
           
            console.log(req.session.passport); //output would be the email of the user logged in
            //Step 1. assigning user's value to email variable , also called destructing
            const { user:email } = req.session.passport;
            //Step 2. Getting all the details of the logged in user, by using the email from Step 1 and calling the
            //mongoose database, which will give all the id, name and everything and storing it to user variable
            const user = await User.findOne({email: email});
            //Step 3, then creating the blog, using the '_id' of the user from database , 
            //which will make sure that the logged in user, created the post,!! awesome
            const blog = await Blog.create({user: user._id, ...req.body});

            req.flash('success', 'Blog created successfully');
            res.redirect(`/blogs/${blog.id}`);
        } catch(error){
            req.flash('danger', `There was an error creating this blog: ${error}`);
            req.session.formData = req.body;
            res.redirect('/blogs/new');
            
        }
    };

exports.edit = async (req,res) => {
    try{
        const blog = await Blog.findById(req.params.id);
        res.render(`${viewPath}/edit`, {
            pageTitle: blog.title,
            formData: blog
        });
    }catch (error) {
        req.flash('danger', `There was an error accessing this 
        blog: ${error}`);
        res.redirect('/');
    }
};  

exports.update = async (req,res) => {
    try{

        const { user:email } = req.session.passport;
        const user = await User.findOne({email: email});

        let blog = await Blog.findById(req.body.id);
        if(!blog) throw new Error('Blog could not be found');

        /*blog.title = req.body.title;
        blog.content = req.body.content;
        blog.status = req.body.status;
        blog.save();*/
        //after this line below only validate would work
        const attributes = {user: user._id, ...req.body};
        await Blog.validate(attributes);
        //await Blog.updateOne({_id: attributes.id}, attributes);
        await Blog.findByIdAndUpdate(attributes.id, attributes);

        req.flash('success', 'The blog was updated successfully');
        res.redirect(`/blogs/${req.body.id}`);
    }
    catch(error){
        req.flash('danger', `There was an error updating this 
        blog: ${error}`);
        res.redirect(`/blogs/${req.body.id}/edit`);
    }
};

exports.delete = async (req,res) => {
    try{
        await Blog.deleteOne({_id: req.body.id});
        req.flash('success', 'The blog was deleted successfully');
        res.redirect(`/blogs`);
    }
    catch{
        req.flash('danger', `There was an error deleting this 
        blog: ${error}`);
        res.redirect(`/blogs`);
    }
};

