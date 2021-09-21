var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect("mongodb+srv://aranda:azerty@cluster0.semua.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    options,
    function(err){
        if(err){
            console.log(err);
        } else {
            console.log('_________BDD OKAY_______')
        }
    }
)

module.exports = mongoose