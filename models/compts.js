const mongoose = require('mongoose')

const comptShema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    cantidad: {
        type: String,
        required: true
    },
    precio: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Compt = mongoose.model('Compt', comptShema)

module.exports = Compt