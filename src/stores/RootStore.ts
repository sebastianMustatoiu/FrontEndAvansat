import AuthStore from "./AuthStore";
import TaskStore from "./TaskStore";

class RootStore {
    authStore: AuthStore;
    taskStore: TaskStore;

    constructor() {
        this.authStore = new AuthStore();
        this.taskStore = new TaskStore();
    }
}

const rootStore = new RootStore();
export default rootStore;
