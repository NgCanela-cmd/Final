const express = require('express')
const router = express.Router()
const Compt = require('../models/compts')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { resourceLimits } = require('worker_threads')

const carpetaUpload = path.join(__dirname, '../upload')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, carpetaUpload)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({
    storage: storage
}).single('image')



router.get('/', async (req, res) => {

    try {
        const compts = await Compt.find({})
        res.render('index', { titulo: 'Inicio', compts: compts, activo: 'active' })

    }catch(error) {
        res.json({ message: error.message })
    }
   
})

router.get('/table', async (req, res) => {

    try {
        const compts = await Compt.find({})
        res.render('tablecomp', { titulo: 'Listado de Produtos', compts: compts, activo: 'active' })

    }catch(error) {
        res.json({ message: error.message })
    }
   
})

router.get('/add', (req, res) => {
    res.render('addcomp', { titulo: 'Agregar Producto', activo: 'active'})
})



router.post('/add', upload, (req, res) =>{
    const compt = new Compt({
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        image: req.file.filename,
        descripcion: req.body.descripcion,
        cantidad: req.body.cantidad,
        precio: req.body.precio
    })
    compt.save().then(() => {
        req.session.message = {
            message: 'Producto Agregado correctamente!',
            type: 'success'
        }

        res.redirect('/table')
    }).catch((error) => {
        res.json({
            message: error.message,
            type: 'danger'
        })
    })
})

// Editar
router.get('/edit/:id', async (req, res) =>{
    const id = req.params.id

    try {
        const compt = await Compt.findById(id)

        if(compt == null) {
            res.redirect('/')
        }else {
            res.render('editcomp',{
                titulo: 'Editar Producto',
                compt: compt,
                activo: 'active'
            })
        }
    }catch(error){
        res.status(500).send()
    }
})

//Actualizar
router.post('/update/:id', upload, async (req, res) => {
    const id = req.params.id

    let new_image

    if(req.file){
        new_image = req.file.filename

        try {
            fs.unlinkSync('./upload/' + req.body.old_image)
        }catch(error){
            console.log(error)
        }
    }else {
        new_image = req.body.old_image
    }

    try {
        await Compt.findByIdAndUpdate(id, {
            codigo: req.body.codigo,
            nombre: req.body.nombre,
            image: new_image,
            descripcion: req.body.descripcion,
            cantidad: req.body.cantidad,
            precio: req.body.precio
        })

        req.session.message = {
            message: 'Producto Editado correctamente!',
            type: 'success'
        }

        res.redirect('/table')
    }catch(error){
        res.json({
            message: error.message,
            type: 'danger'
        })
    }
})

// Eliminar
router.get('/delete/:id', async (req, res) =>{
    const id = req.params.id

    try{
        const compt = await Compt.findByIdAndDelete(id)

        if(compt != null && compt.image != ''){
            try{
                fs.unlinkSync('./upload/' + compt.image)
            }
            catch(error){
                console.log(error)
            }
        }

        req.session.message = {
            message: 'Producto Eliminado correctamente!',
            type: 'info'
        }

        res.redirect('/table')
    }catch(error){
        res.json({
            message: error.message,
            type: 'danger'
        })
    }
})
module.exports = router
//referencia a la ruta de providencia