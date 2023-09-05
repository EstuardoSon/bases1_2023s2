const express = require('express');
const router = express.Router();

const queryController = require('../controller/queryController');
const fillController = require('../controller/fillController');


// Model routes
router.get('/crearmodelo', fillController.crearmodelo);
router.get('/eliminarmodelo', fillController.eliminarmodelo);
router.get('/cargartabtemp', fillController.cargartabtemp);
router.get('/eliminartabtemp', fillController.eliminartabtemp);
router.get('/cargarmodelo', fillController.cargarmodelo);

// Query routes
router.get('/consulta1', queryController.consulta1);
router.get('/consulta2', queryController.consulta2);
router.get('/consulta3', queryController.consulta3);
router.get('/consulta4', queryController.consulta4);
router.get('/consulta5', queryController.consulta5);

module.exports = router;