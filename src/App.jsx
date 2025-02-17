// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(tasks[index]);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedItem(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedOverItem = tasks[index];
    if (draggedItem === draggedOverItem) return;

    const newTasks = tasks.filter(task => task !== draggedItem);
    newTasks.splice(index, 0, draggedItem);
    setTasks(newTasks);
  };

  return (
    <div className="app">
      <div className="todo-container">
        <h1>Tasks</h1>
        <p className="subtitle">Drag and drop to reorder your tasks</p>
        
        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="task-input"
          />
        </form>

        <div className="task-list">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="task-item"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
            >
              <div className="drag-handle">⋮⋮</div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="task-checkbox"
              />
              <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="delete-button"
                aria-label="Delete task"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;