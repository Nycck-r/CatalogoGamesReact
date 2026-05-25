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

    function handleLogout() {
        localStorage.removeItem('token_catalogo');
        setAutenticado(false);
    }

    if (!autenticado) {
        return <Login onLoginSuccess={() => setAutenticado(true)} />;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9' }}>
            
            {/* Sidebar de Navegação */}
            <aside style={{ width: '250px', backgroundColor: '#008542', color: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
                <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    <h2 style={{ margin: 0, fontSize: '22px', color: '#FFCD00' }}>Catálogo Web</h2>
                    <p style={{ fontSize: '12px', color: '#e0e0e0', marginTop: '5px' }}>Painel Administrativo</p>
                </div>
                
                <nav style={{ flex: 1, padding: '20px 0' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li>
                            <button 
                                onClick={() => setTelaAtiva('jogos')}
                                style={{ width: '100%', textAlign: 'left', padding: '15px 20px', backgroundColor: telaAtiva === 'jogos' ? '#006431' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: telaAtiva === 'jogos' ? 'bold' : 'normal', transition: '0.2s' }}>
                                🎮 Gerenciar Jogos
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => setTelaAtiva('categorias')}
                                style={{ width: '100%', textAlign: 'left', padding: '15px 20px', backgroundColor: telaAtiva === 'categorias' ? '#006431' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: telaAtiva === 'categorias' ? 'bold' : 'normal', transition: '0.2s' }}>
                                📁 Categorias
                            </button>
                        </li>
                    </ul>
                </nav>
                
                <div style={{ padding: '20px' }}>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Área Principal Dinâmica */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <header style={{ marginBottom: '30px', borderBottom: '3px solid #FFCD00', paddingBottom: '10px' }}>
                    <h1 style={{ margin: 0, color: '#333' }}>
                        {telaAtiva === 'jogos' ? 'Painel de Jogos' : 'Painel de Categorias'}
                    </h1>
                </header>
                
                {/* Renderiza a tela escolhida na Sidebar */}
                {telaAtiva === 'jogos' ? <GerenciarJogos /> : <GerenciarCategorias />}
            </main>
            
        </div>
    );
}