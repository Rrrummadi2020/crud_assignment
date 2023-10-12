const Device = require('./../models/device');

exports.getAllDevices = async (req, res) => {
    console.log(Device);
    const devices = await Device.find()
    res.status(200).json({ devices });
}
exports.createDevices = async (req, res) => {
    const device = new Device(req.body);
    const newDevice = await device.save();
    res.status(201).json({ newDevice });
}
exports.deleteDevice = async (req, res) => {
    const device = await Device.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'deleted successfully', device });
}
exports.getDevice = async (req, res) => {
    const device = await Device.findById(req.params.id);
    res.status(200).json({ device });
}