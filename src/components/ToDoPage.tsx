import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const ToDoPage: React.FC = observer(() => {
    const { taskStore, authStore } = useStore();
    const [newTask, setNewTask] = useState('');
    const [category, setCategory] = useState('');
    const [deadline, setDeadline] = useState('');
    const [comments, setComments] = useState('');
    const [priority, setPriority] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [expandedTasks, setExpandedTasks] = useState<{ [key: string]: boolean }>({});
    const [isFiltered, setIsFiltered] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        taskStore.fetchTasks();
    }, [taskStore]);

    const addTask = () => {
        taskStore.addTask(newTask, category, deadline, comments, priority);
        setNewTask('');
        setCategory('');
        setDeadline('');
        setComments('');
        setPriority('');
        setShowForm(false);
    };

    const toggleTask = (id: string) => {
        taskStore.toggleTask(id);
    };

    const deleteTask = (id: string) => {
        taskStore.deleteTask(id);
    };

    const handleLogout = async () => {
        await authStore.logout();
        navigate('/login');
    };

    const toggleExpand = (id: string) => {
        setExpandedTasks(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const tasksToDisplay = isFiltered ? taskStore.sortedTasksByPriority : taskStore.tasks;

    return (
        <div id="root" className="todo-container">
            <h2>To-do List</h2>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
            <button onClick={() => setShowForm(!showForm)} className="add-task-button">
                Add Task
            </button>
            <button onClick={() => setIsFiltered(!isFiltered)} className="filter-button">
                {isFiltered ? 'Show All' : 'Filter by Priority'}
            </button>
            {showForm && (
                <div className="add-task-form">
                    <input
                        type="text"
                        placeholder="Task name"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Category (optional)"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Deadline (optional)"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                    <textarea
                        placeholder="Comments (optional)"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="">Select priority (optional)</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <button onClick={addTask} className="add-task-button">
                        Add
                    </button>
                </div>
            )}
            <ul className="task-list">
                {tasksToDisplay.map((task) => (
                    <li key={task.id} className="task-item">
                        <div className="task-content">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="task-checkbox"
                            />
                            <span onClick={() => toggleExpand(task.id)} className="task-title">
                                {task.text}
                            </span>
                        </div>
                        <div className={`task-details ${expandedTasks[task.id] ? 'expanded' : ''}`}>
                            {task.category && <div>Category: {task.category}</div>}
                            {task.deadline && <div>Deadline: {task.deadline}</div>}
                            {task.comments && <div>Comments: {task.comments}</div>}
                            {task.priority && <div>Priority: {task.priority}</div>}
                        </div>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default ToDoPage;
