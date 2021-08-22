import React, { useState, useEffect } from 'react'

export default function App() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [idEditing, setIdEditing] = useState('');

    const addTask = (e) => {
        console.log('title: ', title, ' description: ',description);
        
        if(idEditing){
            fetch('/api/update/'+idEditing, {
                method: 'PUT',
                body: JSON.stringify({title, description}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
            .then(data => {
                console.log(data);
                fetchTasks();
                M.toast({html:'Task updated'})
                setTitle('')
                setDescription('')
                setIdEditing('')
            })
        }else{
            fetch('/api/add', {
                method: 'POST',
                body: JSON.stringify({title, description}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                M.toast({html: 'Task saved'})
                setTitle('');
                setDescription('');
                fetchTasks();
            })
            .catch(err => console.error(err))
        }

        e.preventDefault();
    }

    const fetchTasks = (e) => {
        fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
            setTasks(data)
            console.log(tasks);
        })
        .catch(err => console.error(err))
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        switch(name){
            case 'title': setTitle(value); break;

            case 'description': setDescription(value); break;
        }
    }

    const deleteTask = (id) => {
        if(confirm('Are you sure you want to delete this task?')){
            fetch(`/api/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                M.toast({html: 'Task deleted'})
                fetchTasks();
            })
            .catch(err => console.error(err))
        }
    }

    const editTask = (id) => {
        fetch('/api/task/'+id)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setTitle(data.title);
            setDescription(data.description);
            setIdEditing(id);
        })
    }

    useEffect(() => {
        fetchTasks();
    },[])

    return (
        <div>
            {/* NAVIGATION */}
            <nav className="light-blue darken-4">
                <div className="container">
                    <a className="brand-logo" href="/">Mern stack</a>
                </div>
            </nav>

            <div className="container">
                <div className="row">
                     <div className="col s5">
                        <div className="card">
                            <div className="card-content">
                               <form onSubmit={addTask}>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input type="text" name="title" onChange={handleChange} placeholder="Task title" autoComplete="off" value={title}/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea className="materialize-textarea" name="description" onChange={handleChange} placeholder="Task description" autoComplete="off" value={description}></textarea>
                                        </div>
                                    </div>
                                    <button className="btn light-blue darken-4" type="submit">
                                        Send
                                    </button>
                               </form> 
                            </div>
                        </div>
                     </div>
                     <div className="col s7">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tasks.map(task => {
                                        return (
                                            <tr key={task._id}>
                                                <td>{task.title}</td>
                                                <td>{task.description}</td>
                                                <td>
                                                    <button className="btn light-blue darken-4" onClick={() => deleteTask(task._id)}>
                                                        <i className="material-icons">delete</i>
                                                    </button>
                                                    <button className="btn light-blue darken-4" style={{margin: '4px'}} onClick={() => editTask(task._id)}>
                                                        <i className="material-icons">edit</i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                     </div>
                </div>
            </div>
        </div>
    )
}
