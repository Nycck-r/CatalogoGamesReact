import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { GerenciarCategorias } from './components/GerenciarCategorias';
import { GerenciarJogos } from './components/GerenciarJogos';

export default function App() {
    const [autenticado, setAutenticado] = useState(false);
    const [telaAtiva, setTelaAtiva] = useState('jogos');

    useEffect(() => {
        const token = localStorage.getItem('token_catalogo');
        if (token) setAutenticado(true);
    }, []);

    if (!autenticado) return <Login onLoginSuccess={() => setAutenticado(true)} />;

    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
            <aside className="sidebar" style={{ width: '280px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #eaeaea', flexShrink: 0, zIndex: 10 }}>
                <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111', animation: 'fadeIn 0.5s ease' }}>
                        <i className="fa-solid fa-gamepad" style={{ color: '#e60000', marginRight: '10px' }}></i>LEVELUP
                    </h2>
                </div>
                
                <nav style={{ flex: 1, padding: '10px 0' }}>
                    <button onClick={() => setTelaAtiva('jogos')} style={{ width: '100%', padding: '15px 25px', textAlign: 'left', border: 'none', backgroundColor: telaAtiva === 'jogos' ? '#fef2f2' : 'transparent', color: telaAtiva === 'jogos' ? '#e60000' : '#444', fontWeight: '600', cursor: 'pointer', borderLeft: telaAtiva === 'jogos' ? '4px solid #e60000' : '4px solid transparent', transition: '0.2s' }}>
                        <i className="fa-solid fa-dice" style={{ width: '25px' }}></i> Biblioteca
                    </button>
                    <button onClick={() => setTelaAtiva('categorias')} style={{ width: '100%', padding: '15px 25px', textAlign: 'left', border: 'none', backgroundColor: telaAtiva === 'categorias' ? '#fef2f2' : 'transparent', color: telaAtiva === 'categorias' ? '#e60000' : '#444', fontWeight: '600', cursor: 'pointer', borderLeft: telaAtiva === 'categorias' ? '4px solid #e60000' : '4px solid transparent', transition: '0.2s' }}>
                        <i className="fa-solid fa-tags" style={{ width: '25px' }}></i> Categorias
                    </button>
                </nav>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
                    <a href="#" className="social-icon"><i className="fa-brands fa-github"></i></a>
                    <a href="#" className="social-icon"><i className="fa-brands fa-steam"></i></a>
                    <a href="#" className="social-icon"><i className="fa-brands fa-discord"></i></a>
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
                    <button onClick={() => { localStorage.clear(); setAutenticado(false); }} style={{ width: '100%', padding: '12px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}>
                        SAIR DO SISTEMA
                    </button>
                </div>
            </aside>

            <main className="main-content" style={{ flex: 1, padding: '40px', backgroundColor: '#f8f9fa', overflowY: 'auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '30px', animation: 'fadeIn 0.5s ease' }}>
                    {telaAtiva === 'jogos' ? 'Biblioteca de Jogos' : 'Categorias do Sistema'}
                </h1>
                {telaAtiva === 'jogos' ? <GerenciarJogos /> : <GerenciarCategorias />}
            </main>
        </div>
    );
}