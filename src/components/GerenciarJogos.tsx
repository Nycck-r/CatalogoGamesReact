import React, { useState, useEffect } from 'react';
import { apiService } from '../apiService';
import { Classificacao } from '../types';
import type { Jogo, Categoria } from '../types';

export function GerenciarJogos() {
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
    
    const [idEdicao, setIdEdicao] = useState<number | null>(null);
    const [titulo, setTitulo] = useState('');
    const [preco, setPreco] = useState(0);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [classificacao, setClassificacao] = useState<Classificacao>(Classificacao.Livre);
    const [categoriaId, setCategoriaId] = useState<number>(0);

    useEffect(() => { carregarDados(); }, []);

    async function carregarDados() {
        const [j, c] = await Promise.all([apiService.request('/jogos'), apiService.request('/categorias')]);
        setJogos(j); setCategorias(c);
        if (c.length > 0 && !categoriaId) setCategoriaId(c[0].id);
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        const body = { id: idEdicao || 0, titulo, precoOriginal: preco, anoLancamento: ano, classificacao, categoriaId };
        try {
            if (idEdicao) await apiService.request(`/jogos/${idEdicao}`, { method: 'PUT', body: JSON.stringify(body) });
            else await apiService.request('/jogos', { method: 'POST', body: JSON.stringify(body) });
            fecharModal(); carregarDados();
        } catch (err) { alert("Erro ao salvar jogo."); }
    }

    function prepararEdicao(jogo: Jogo) {
        setIdEdicao(jogo.id); setTitulo(jogo.titulo); setPreco(jogo.precoOriginal);
        setAno(jogo.anoLancamento); setClassificacao(jogo.classificacao);
        setCategoriaId(jogo.categoriaId); setIsModalOpen(true);
    }

    function fecharModal() { setIsModalOpen(false); setIdEdicao(null); setTitulo(''); setPreco(0); }

    async function confirmarExclusao() {
        if (!idParaExcluir) return;
        await apiService.request(`/jogos/${idParaExcluir}`, { method: 'DELETE' });
        setIdParaExcluir(null);
        carregarDados();
    }

    return (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <button onClick={() => setIsModalOpen(true)} style={{ padding: '12px 24px', backgroundColor: '#e60000', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginBottom: '30px', transition: '0.2s', boxShadow: '0 4px 12px rgba(230,0,0,0.2)' }}>
                <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> ADICIONAR JOGO
            </button>

            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                {jogos.map((j, index) => (
                    <div key={j.id} className="card-hover animate-slide-up" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #eee', position: 'relative', animationDelay: `${index * 0.05}s` }}>
                        <span style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '12px', fontWeight: '800', backgroundColor: '#111', color: '#fff', padding: '4px 10px', borderRadius: '6px' }}>{j.anoLancamento}</span>
                        
                        <h3 style={{ fontSize: '20px', marginBottom: '5px', color: '#111', paddingRight: '50px' }}>{j.titulo}</h3>
                        <p style={{ fontSize: '13px', color: '#e60000', fontWeight: '600', marginBottom: '15px' }}>{j.categoria}</p>
                        
                        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                            <div style={{ fontSize: '12px', color: '#999' }}>Preço Base: R$ {j.precoOriginal.toFixed(2)}</div>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>R$ {j.precoComDesconto?.toFixed(2)}</div>
                        </div>

                        {/* Plataformas (Apenas visual) */}
                        <div style={{ display: 'flex', gap: '15px', color: '#999', fontSize: '18px', marginBottom: '20px', justifyContent: 'center' }}>
                            <i className="fa-brands fa-steam social-icon"></i>
                            <i className="fa-brands fa-playstation social-icon"></i>
                            <i className="fa-brands fa-xbox social-icon"></i>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => prepararEdicao(j)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#111', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}>EDITAR</button>
                            <button onClick={() => setIdParaExcluir(j.id)} style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #ffe5e5', backgroundColor: '#fff', color: '#e60000', cursor: 'pointer', transition: '0.2s' }}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Formulário */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-gamepad" style={{ color: '#e60000' }}></i>
                            {idEdicao ? 'Editar Jogo' : 'Novo Jogo'}
                        </h2>
                        <form onSubmit={handleSalvar} className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Título do Jogo</label>
                                <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required placeholder="Ex: The Last of Us" />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Preço (R$)</label>
                                <input type="number" step="0.01" value={preco} onChange={e => setPreco(Number(e.target.value))} required />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Ano</label>
                                <input type="number" value={ano} onChange={e => setAno(Number(e.target.value))} required />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Classificação</label>
                                <select value={classificacao} onChange={e => setClassificacao(Number(e.target.value))}>
                                    <option value={Classificacao.Livre}>Livre</option>
                                    <option value={Classificacao.DezAnos}>+10 Anos</option>
                                    <option value={Classificacao.DozeAnos}>+12 Anos</option>
                                    <option value={Classificacao.DezoitoAnos}>+18 Anos</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Categoria</label>
                                <select value={categoriaId} onChange={e => setCategoriaId(Number(e.target.value))}>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                </select>
                            </div>
                            <div style={{ gridColumn: '1 / -1', marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 2, padding: '14px', backgroundColor: '#e60000', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>SALVAR REGISTRO</button>
                                <button type="button" onClick={fecharModal} style={{ flex: 1, padding: '14px', backgroundColor: '#eee', color: '#444', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>CANCELAR</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {idParaExcluir && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#ffe5e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                            <i className="fa-solid fa-trash-can" style={{ fontSize: '24px', color: '#e60000' }}></i>
                        </div>
                        <h2 style={{ marginBottom: '10px', fontSize: '20px' }}>Excluir Jogo?</h2>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>O jogo será removido permanentemente da sua biblioteca.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={confirmarExclusao} style={{ flex: 1, padding: '12px', backgroundColor: '#e60000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Sim, Excluir</button>
                            <button onClick={() => setIdParaExcluir(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#eee', color: '#444', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}