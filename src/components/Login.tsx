import React, { useState } from 'react';
import { apiService } from '../apiService';

interface LoginProps {
    onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [isRegistro, setIsRegistro] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmeter(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        setSucesso('');
        setLoading(true);
        
        try {
            if (isRegistro) {
                // Rota de Cadastro
                await apiService.request('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ usuario, senha })
                });
                setSucesso('Conta criada com sucesso! Faça login para entrar.');
                setIsRegistro(false); // Volta pra tela de login
                setSenha(''); // Limpa a senha por segurança
            } else {
                // Rota de Login
                const data = await apiService.request('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ usuario, senha })
                });
                
                if (data.token) {
                    localStorage.setItem('token_catalogo', data.token);
                    onLoginSuccess();
                }
            }
        } catch (err: any) {
            setErro(err.message || "Usuário ou senha incorretos.");
        } finally {
            setLoading(false);
        }
    }

    function alternarModo() {
        setIsRegistro(!isRegistro);
        setErro('');
        setSucesso('');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            
            {/* Lado Esquerdo - Branding */}
            <div style={{ flex: 1, backgroundColor: '#111', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', backgroundColor: '#e60000', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', backgroundColor: '#e60000', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }}></div>
                
                <div style={{ zIndex: 1, textAlign: 'center', animation: 'fadeIn 1s ease' }}>
                    <i className="fa-solid fa-gamepad" style={{ fontSize: '80px', color: '#e60000', marginBottom: '20px' }}></i>
                    <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-1px' }}>LevelUp</h1>
                    <p style={{ fontSize: '18px', color: '#888', fontWeight: '300', maxWidth: '400px', margin: '0 auto' }}>
                        O painel de controle definitivo para a sua biblioteca de jogos.
                    </p>
                </div>
            </div>

            {/* Lado Direito - Formulário */}
            <div style={{ flex: 1, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: '420px', animation: 'slideUp 0.5s ease' }}>
                    
                    <h2 style={{ fontSize: '32px', color: '#111', margin: '0 0 10px 0', fontWeight: '700' }}>
                        {isRegistro ? "Criar Nova Conta" : "Bem-vindo de volta"}
                    </h2>
                    <p style={{ color: '#666', margin: '0 0 30px 0', fontSize: '15px' }}>
                        {isRegistro ? "Preencha os dados para se cadastrar." : "Por favor, insira seus dados para acessar."}
                    </p>

                    {/* Alertas de Erro ou Sucesso */}
                    {erro && (
                        <div style={{ backgroundColor: '#fff2f2', borderLeft: '4px solid #e60000', padding: '15px', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s ease' }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#e60000' }}></i>
                            <span style={{ color: '#e60000', fontSize: '14px', fontWeight: '500' }}>{erro}</span>
                        </div>
                    )}

                    {sucesso && (
                        <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: '15px', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s ease' }}>
                            <i className="fa-solid fa-circle-check" style={{ color: '#22c55e' }}></i>
                            <span style={{ color: '#166534', fontSize: '14px', fontWeight: '500' }}>{sucesso}</span>
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
                                style={{ width: '100%', padding: '14px 15px 14px 45px', border: '1px solid #eaeaea', borderRadius: '10px', fontSize: '15px', outline: 'none', backgroundColor: '#fcfcfc' }}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
                            <input 
                                type={mostrarSenha ? "text" : "password"} 
                                placeholder="Senha" 
                                value={senha} 
                                onChange={e => setSenha(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '14px 45px', border: '1px solid #eaeaea', borderRadius: '10px', fontSize: '15px', outline: 'none', backgroundColor: '#fcfcfc' }}
                            />
                            {/* Olhinho Mágico para ver a senha */}
                            <i 
                                className={mostrarSenha ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} 
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer', fontSize: '16px' }}
                                title="Mostrar/Ocultar Senha"
                            ></i>
                        </div>

                        {!isRegistro && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#666' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input type="checkbox" style={{ accentColor: '#e60000' }} /> Lembrar de mim
                                </label>
                                <a href="#" style={{ color: '#e60000', textDecoration: 'none', fontWeight: '500' }}>Esqueceu a senha?</a>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ width: '100%', padding: '15px', backgroundColor: '#e60000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', transition: '0.2s', marginTop: '10px', boxShadow: '0 4px 15px rgba(230,0,0,0.2)' }}
                        >
                            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : (isRegistro ? "Criar Conta" : "Entrar no Sistema")}
                        </button>
                    </form>

                    {/* Botão para alternar entre Login e Cadastro */}
                    <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#666' }}>
                        {isRegistro ? "Já tem uma conta? " : "Não tem uma conta? "}
                        <span onClick={alternarModo} style={{ color: '#e60000', fontWeight: '600', cursor: 'pointer' }}>
                            {isRegistro ? "Faça Login" : "Cadastre-se"}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }}></div>
                        <span style={{ padding: '0 15px', color: '#999', fontSize: '13px' }}>Ou acesse com</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{ flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', color: '#111' }}><i className="fa-brands fa-github" style={{ fontSize: '20px' }}></i></button>
                        <button style={{ flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', color: '#111' }}><i className="fa-brands fa-google" style={{ fontSize: '20px' }}></i></button>
                        <button style={{ flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', color: '#0077b5' }}><i className="fa-brands fa-linkedin" style={{ fontSize: '20px' }}></i></button>
                    </div>

                </div>
            </div>

        </div>
    );
}