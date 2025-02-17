import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);

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

  const handleDragStart = (e, index, type) => {
    setDraggedItem({ index, type });
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleDragOver = (e, index, type) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === type) {
      setDraggedOverItem({ index, type });
    }
  };

  const handleDrop = () => {
    if (!draggedItem || !draggedOverItem) return;

    const { index: draggedIndex, type: draggedType } = draggedItem;
    const { index: overIndex, type: overType } = draggedOverItem;

    if (draggedType === overType) {
      const items = draggedType === 'pending' ? pendingTasks : completedTasks;
      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(overIndex, 0, draggedItem);

      if (draggedType === 'pending') {
        setTasks([...newItems, ...completedTasks]);
      } else {
        setTasks([...pendingTasks, ...newItems]);
      }
    }

    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="app">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay muted loop id="bg-video">
          <source src="/videobg2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Heading Block */}
      <div className="heading-block">
        <h1>ToDo App</h1>
        <p className="subtitle">Drag and drop to reorder your tasks</p>
      </div>

      {/* Add Task Block */}
      <div className="add-task-block">
        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="task-input"
          />
        </form>
      </div>

      {/* Pending Tasks Block */}
      <div className="tasks-block">
        <h2>Pending Tasks</h2>
        <div className="task-list" onDrop={handleDrop}>
          {pendingTasks.map((task, index) => (
            <div
              key={task.id}
              className="task-item"
              draggable
              onDragStart={(e) => handleDragStart(e, index, 'pending')}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index, 'pending')}
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

      {/* Completed Tasks Block */}
      {completedTasks.length > 0 && (
        <div className="tasks-block completed-tasks-block">
          <h2>Completed Tasks</h2>
          <div className="task-list" onDrop={handleDrop}>
            {completedTasks.map((task, index) => (
              <div
                key={task.id}
                className="task-item"
                draggable
                onDragStart={(e) => handleDragStart(e, index, 'completed')}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index, 'completed')}
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
      )}
    </div>
  );
}

export default App;
