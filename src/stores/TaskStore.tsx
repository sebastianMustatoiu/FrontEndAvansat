import { makeAutoObservable, runInAction } from "mobx";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore";

interface Task {
    id: string;
    text: string;
    completed: boolean;
    category?: string;
    deadline?: string;
    comments?: string;
    userId: string;
    priority?: 'High' | 'Medium' | 'Low' | '';
}

class TaskStore {
    tasks: Task[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async fetchTasks() {
        if (!auth.currentUser) return;
        const q = query(collection(db, "tasks"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        runInAction(() => {
            this.tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        });
    }

    async addTask(text: string, category?: string, deadline?: string, comments?: string, priority: 'High' | 'Medium' | 'Low' | '' = '') {
        if (!auth.currentUser) return;
        const newTask = { text, completed: false, userId: auth.currentUser.uid, category, deadline, comments, priority };
        const docRef = await addDoc(collection(db, "tasks"), newTask);
        runInAction(() => {
            this.tasks.push({ id: docRef.id, ...newTask });
        });
    }

    async toggleTask(id: string) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) return;
        const updatedTask = { ...task, completed: !task.completed };
        await updateDoc(doc(db, "tasks", id), updatedTask);
        runInAction(() => {
            this.tasks = this.tasks.map(task => task.id === id ? updatedTask : task);
        });
    }

    async deleteTask(id: string) {
        await deleteDoc(doc(db, "tasks", id));
        runInAction(() => {
            this.tasks = this.tasks.filter(task => task.id !== id);
        });
    }

    get sortedTasksByPriority() {
        return this.tasks.slice().sort((a: Task, b: Task) => {
            const priorityOrder: Record<'High' | 'Medium' | 'Low' | '', number> = {
                'High': 3,
                'Medium': 2,
                'Low': 1,
                '': 0,
            };
            return (priorityOrder[b.priority ?? ''] - priorityOrder[a.priority ?? '']);
        });
    }
}

export default TaskStore;
