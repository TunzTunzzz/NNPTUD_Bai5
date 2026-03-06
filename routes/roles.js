var express = require('express');
var router = express.Router();
const Role = require('../models/Role');

// Create
router.post('/', async (req, res) => {
    try {
        const newRole = new Role(req.body);
        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read All
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!updatedRole) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Soft Delete
router.delete('/:id', async (req, res) => {
    try {
        const deletedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!deletedRole) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json({ message: 'Role deleted successfully', role: deletedRole });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
