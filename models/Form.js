const mongoose = require ("mongoose")

const formSchema = new mongoose.Schema({  
    name: String,
    email: String,
    message : String,
    date: String,
    leido: Boolean
});

const FormModel = mongoose.model("Form",formSchema);

module.exports= FormModel;