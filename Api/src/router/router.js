const express = require('express');
const router = express.Router();

const queryController = require('../controller/queryController');
const fillController = require('../controller/fillController');


// Model routes
router.get('/crearmodelo', fillController.crearmodelo);
router.get('/eliminarmodelo', fillController.eliminarmodelo);
router.get('/cargartabtemp', fillController.cargartabtemp);

// Query routes
router.get('/consulta1', queryController.consulta1);
router.get('/consulta2', queryController.consulta2);
router.get('/consulta3', queryController.consulta3);
router.get('/consulta4', queryController.consulta4);
router.get('/consulta5', queryController.consulta5);
router.get('/consulta6', queryController.consulta6);
router.get('/consulta7', queryController.consulta7);
router.get('/consulta8', queryController.consulta8);
router.get('/consulta9', queryController.consulta9);
router.get('/consulta10', queryController.consulta10);
router.get('/consulta11', queryController.consulta11);

module.exports = router;