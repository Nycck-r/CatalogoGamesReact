import React, { useState } from 'react';
import { apiService } from '../apiService';

interface LoginProps {
    onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmeter(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        setLoading(true);
        
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
            setErro("Acesso negado. Verifique suas credenciais.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: "'Poppins', sans-serif" }}>
            
            {/* Lado Esquerdo - Branding (Preto e Vermelho) */}
            <div style={{ flex: 1, backgroundColor: '#111', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', backgroundColor: '#e60000', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', backgroundColor: '#e60000', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }}></div>
                
                <div style={{ zIndex: 1, textAlign: 'center' }}>
                    <i className="fa-solid fa-gamepad" style={{ fontSize: '80px', color: '#e60000', marginBottom: '20px' }}></i>
                    <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-1px' }}>LevelUp</h1>
                    <p style={{ fontSize: '18px', color: '#888', fontWeight: '300', maxWidth: '400px', margin: '0 auto' }}>
                        O painel de controle definitivo para a sua biblioteca de jogos.
                    </p>
                </div>
            </div>

            {/* Lado Direito - Formulário (Branco) */}
            <div style={{ flex: 1, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    
                    <h2 style={{ fontSize: '32px', color: '#111', margin: '0 0 10px 0', fontWeight: '700' }}>Bem-vindo de volta</h2>
                    <p style={{ color: '#666', margin: '0 0 40px 0', fontSize: '15px' }}>Por favor, insira seus dados para acessar.</p>

                    {erro && (
                        <div style={{ backgroundColor: '#fff2f2', borderLeft: '4px solid #e60000', padding: '15px', borderRadius: '4px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#e60000' }}></i>
                            <span style={{ color: '#e60000', fontSize: '14px', fontWeight: '500' }}>{erro}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmeter} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div style={{ position: 'relative' }}>
                            <i className="fa-regular fa-user" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
                            <input 
                                type="text" 
                                placeholder="Usuário" 
                                value={usuario} 
                                onChange={e => setUsuario(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '14px 15px 14px 45px', border: '1px solid #eaeaea', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: '0.2s', backgroundColor: '#fcfcfc' }}
                                onFocus={(e) => e.target.style.borderColor = '#e60000'}
                                onBlur={(e) => e.target.style.borderColor = '#eaeaea'}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
                            <input 
                                type="password" 
                                placeholder="Senha" 
                                value={senha} 
                                onChange={e => setSenha(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '14px 15px 14px 45px', border: '1px solid #eaeaea', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: '0.2s', backgroundColor: '#fcfcfc' }}
                                onFocus={(e) => e.target.style.borderColor = '#e60000'}
                                onBlur={(e) => e.target.style.borderColor = '#eaeaea'}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#666' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: '#e60000' }} /> Lembrar de mim
                            </label>
                            <a href="#" style={{ color: '#e60000', textDecoration: 'none', fontWeight: '500' }}>Esqueceu a senha?</a>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ width: '100%', padding: '15px', backgroundColor: '#e60000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', transition: '0.2s', marginTop: '10px', boxShadow: '0 4px 15px rgba(230,0,0,0.2)' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#cc0000'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e60000'}
                        >
                            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : "Entrar no Sistema"}
                        </button>
                    </form>

                    {/* Divisor */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }}></div>
                        <span style={{ padding: '0 15px', color: '#999', fontSize: '13px' }}>Ou acesse com</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }}></div>
                    </div>

                    {/* Botões Sociais */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{ flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#111' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                            <i className="fa-brands fa-github" style={{ fontSize: '20px' }}></i>
                        </button>
                        <button style={{ flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#111' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                            <i className="fa-brands fa-google" style={{ fontSize: '20px' }}></i>
                        </button>
                        <button style={{ flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0077b5' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                            <i className="fa-brands fa-linkedin" style={{ fontSize: '20px' }}></i>
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
}