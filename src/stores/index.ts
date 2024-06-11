import TaskStore from './TaskStore';
import AuthStore from './AuthStore';

const taskStore = new TaskStore();
const authStore = new AuthStore();

export { taskStore, authStore };
