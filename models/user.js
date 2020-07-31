const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
   firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        validate: [
            {   
                //validation for emailconfirmation
                validator: function (value) {
                    return this.emailConfirmation === value;
                },
                message: props => `${props.value} doesn't match the email confirmation`
            },
            {   
                //validation for if the email already exists, to avoid duplicate email registering
                validator: async function (value){
                    const emailCount = await this.model('User').count (
                        {email: value});
                        console.log(!emailCount);
                    return !emailCount
                },
                message: props => `${props.value} exists. Please try a new email or login`
            }
        ]
    }
}, {
    timestamps: true,
    toJSON: {
        getters:true
        //toJSON getters:true , will help to carry the virtual functions to the front end , in our case to React
        //With doing that, we won't be able to access virtual functions below, such as emailConfirmation, fullname etc. from the front end
    }
});

//the virtual logic below, helps to set and get values
// Validation attributes
UserSchema.virtual('emailConfirmation')
.get(function () {
    return this._emailConfirmation;
})
.set(function (value) {
    this._emailConfirmation = value;
});

//cmd + alt + down , to write in multiple lines same time
UserSchema.virtual('password')
.get(function(){
    return this._password;
})
.set(function(value){
    this._password = value;
});
UserSchema.virtual('passwordConfirmation')
.get(function(){
    return this._passwordConfirmation;
})
.set(function(value){
    if(this.password !== value)
        this.invalidate('password', 'Password and password confirmation must match');
    this._passwordConfirmation = value;
});


//Helper attributes
UserSchema.virtual('fullname')
.get(function() {
    return `${this.firstName} ${this.lastName}`
});

//this plugin helps to define default login strategy, 
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', UserSchema);