const mongoose = require('mongoose');

//create blog schema
const BlogSchema = new mongoose.Schema({
     //establishing connection between user and blog models
     user: {
        type: mongoose.Schema.Types.ObjectId,
        //mongoose automatically establishes the connection
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true //This must exist    
    },
    content: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED'],
        default: 'DRAFT'
    },
 }, {
    timestamps: true,
    toJSON: {
        getters: true
    }
});

//Query Helpers
//we are using function rather, than "this" keyboard, Because
// arrow function 'this' is a block level. It is limited to the block only
//whereas 'function' keyword 'this' , is a whole class level
BlogSchema.query.drafts = function (){
     return this.where({
         status: 'DRAFT'
  })
};
BlogSchema.query.published = function (){
     return this.where({
         status: 'PUBLISHED'
  })
};

//creating another short summary function of BlogSchema, for just accessing the content with 250 characters 
BlogSchema.virtual('synopsis')
   .get(function () {
        const post = this.content;
        return post
        .replace(/(<([^>]+)>)/ig,"")
        .substring(0, 250);
   });

//'Blog' is the name of the model. We can name it whatever we want
//Secondly, we are exporting the BlogSchema of this model
//module.exports is used because we are exporting only one item from this schema
//if we have to export more , we would rather use , exports.thefiles
module.exports = mongoose.model('Blog', BlogSchema);