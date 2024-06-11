import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreContext';
import '../index.css';

const AuthPage: React.FC = observer(() => {
    const { authStore } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isRegister) {
            await authStore.register(email, password);
        } else {
            await authStore.login(email, password);
        }
    };

    return (
        <div className="auth-form">
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            {isRegister ? authStore.registerError && <p className="error-message">{authStore.registerError}</p> : authStore.loginError && <p className="error-message">{authStore.loginError}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="button-group">
                    <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
                    <button type="button" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? 'Switch to Login' : 'Switch to Register'}
                    </button>
                </div>
            </form>
        </div>
    );
});

export default AuthPage;
