import React, { useState } from 'react';
import { apiService } from '../apiService';

interface LoginProps {
    onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    async function handleSubmeter(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        try {
            const data = await apiService.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ usuario, senha })
            });
            if (data.token) {
                localStorage.setItem('token_catalogo', data.token);
                onLoginSuccess();
            }
        } catch (err: any) {
            setErro(err.message || "Usuário ou senha incorretos.");
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>🔐 Login - Catálogo de Jogos</h2>
            {erro && <p style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>{erro}</p>}
            <form onSubmit={handleSubmeter}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Usuário:</label>
                    <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Senha:</label>
                    <input type="password" value={senha} onChange={e => setSenha(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Entrar no Sistema
                </button>
            </form>
        </div>
    );
}