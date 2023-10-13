const express = require('express');
const { getAllDevices, getDevice, deleteDevice, createDevices, updateDevice } = require('../controllers/device');
const router = express.Router();

router.route('/').get(getAllDevices).post(createDevices);

router.route('/:id').get(getDevice).delete(deleteDevice).put(updateDevice);

module.exports = router;