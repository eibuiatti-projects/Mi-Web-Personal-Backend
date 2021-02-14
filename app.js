require ('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const PORT = 3001;
const Form = require("./models/Form");


//Aplico Middlewares

app.use(express.json());
app.use(cors());
app.use(morgan("short"));


//Recibo los datos del frontend y los envio a la base de datos

app.post('/submitForm',function(req,res){
    const newDate = new Date()
    let form = new Form({
        name: req.body.name,
        email: req.body.email,
        message : req.body.message,
        date: `${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()} ${newDate.getUTCHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`,
        leido: false
    });
    form.save().then(function(formSaved){
        res.status(201).send({form:formSaved});
    }).catch(function(err){
        res.status(500).send({error:"Error interno, no se pudo guardar"});
        console.log(err);
    })
})


//Recibo peticion desde el backoffice

app.get('/formList', function (req, res){

    Form.find().then(function(forms){
        if(forms) return res.status(200).send(forms)
        res.status(404).send({message:"No existen formularios para mostrar"});
    }).catch(function(error){
        res.status(500).send({message:"Error interno, no se pudo realizar la busqueda"})
    });

})


//Recibo el cambio del estado de la propiedad "leido" desde el backoffice

app.patch('/formState/:id',function(req,res){
   
    Form.findByIdAndUpdate(req.params.id, { leido: req.body.leido }, function (error, formUpdated) { 
        if (error){ 
            return res.status(404).send({message:"No existe ese formulario"})
        }    
        res.status(201).send({message:"campo modificado"})
    }).catch(function(error){
        res.status(500).send({message:"Error interno, no se pudo realizar la busqueda"})
    });
       
})


//Recibo el id del formulario a borrar desde el backoffice

app.delete('/deleteForm/:id',function(req,res){
    
    Form.findByIdAndDelete(req.params.id, function (error, formDeleted) { 
        if (error){ 
            return res.status(404).send({message:"No existe ese formulario"})
        } 
        res.status(200).send({message:"campo eliminado"}) 
    }).catch(function(error){
        res.status(500).send({message:"Error interno, no se pudo realizar la busqueda"})
    });

});


//Conecto a la base de datos y luego levanto el servidor

mongoose.connect(process.env.CONNECTION_STRING,{ useUnifiedTopology: true, useNewUrlParser: true}, function (err) {

    if (err) {
        console.error(err.message)
    } else {
        console.log("Conexion a la base de datos establecida...");
        app.listen(process.env.PORT || PORT, function () {
            console.log("Servidor escuchando...");
        });
    }

})