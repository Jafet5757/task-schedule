const express = require('express');
const router = express.Router();
const Task = require('./../models/task');

router.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

router.get('/api/task/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.json(task);
})

router.post('/api/add', async (req, res) => {
    const {title, description} = req.body;
    const task = new Task({title, description})
    await task.save();
    res.json({status: 'Task saved'})
})

router.put('/api/update/:id', async (req, res) => {
    const {title, description} = req.body;
    const newTask = {title, description};
    //para obtener el id que nos pasan por parametro
    //usamos req.params.id
    await Task.findByIdAndUpdate(req.params.id, newTask)
    res.json({status: 'Task uploaded'})
})

router.delete('/api/delete/:id', async (req, res) => {
    await Task.findByIdAndRemove(req.params.id);
    res.json({status: 'Task deleted'})
})

module.exports = router;