import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ToDoPage from './components/ToDoPage';
import { observer } from 'mobx-react-lite';
import { useStore } from './stores/StoreContext';

const App: React.FC = observer(() => {
    const { authStore } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authStore.user) {
            navigate('/login');
        } else {
            navigate('/todos');
        }
    }, [authStore.user, navigate]);

    return (
        <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/todos" element={authStore.user ? <ToDoPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
});

export default App;
