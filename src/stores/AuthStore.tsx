import { makeAutoObservable, runInAction } from "mobx";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";
import { taskStore } from "./index";

import { setPersistence, browserLocalPersistence } from "firebase/auth";

class AuthStore {
    user: User | null = null;
    loginError: string | null = null;
    registerError: string | null = null;

    constructor() {
        makeAutoObservable(this);
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                auth.onAuthStateChanged(async (user) => {
                    runInAction(() => {
                        this.user = user;
                        this.loginError = null;
                        this.registerError = null;
                    });
                    if (user) {
                        console.log("User authenticated:", user);
                        await taskStore.fetchTasks();
                    }
                    console.log("Auth state changed:", user);
                });
            })
            .catch((error) => {
                console.error("Failed to set auth persistence:", error);
            });
    }

    async login(email: string, password: string) {
        try {
            console.log("Attempting to log in with email:", email);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            runInAction(() => {
                this.user = userCredential.user;
                this.loginError = null;
                console.log("Logged in successfully:", auth.currentUser);
            });
            await taskStore.fetchTasks();
        } catch (error) {
            runInAction(() => {
                this.loginError = "Failed to authenticate. Please check your credentials.";
            });
            console.error("Failed to login:", error);
        }
    }

    async register(email: string, password: string) {
        try {
            console.log("Attempting to register with email:", email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            runInAction(() => {
                this.user = userCredential.user;
                this.registerError = null;
                console.log("Registered successfully:", auth.currentUser);
            });
            await taskStore.fetchTasks();
        } catch (error) {
            runInAction(() => {
                this.registerError = "Failed to register. Please check your credentials.";
            });
            console.error("Failed to register:", error);
        }
    }

    async logout() {
        try {
            await signOut(auth);
            runInAction(() => {
                this.user = null;
                this.loginError = null;
                this.registerError = null;
                taskStore.tasks = [];
                console.log("Logged out successfully");
            });
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    }
}

export default AuthStore;
