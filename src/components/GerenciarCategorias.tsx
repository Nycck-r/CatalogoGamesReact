import React, { useState, useEffect } from 'react';
import { apiService } from '../apiService';
import type { Categoria } from '../types';

export function GerenciarCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [nome, setNome] = useState('');
    const [idEdicao, setIdEdicao] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

    useEffect(() => { carregarCategorias(); }, []);

    async function carregarCategorias() {
        const dados = await apiService.request('/categorias');
        setCategorias(dados);
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (idEdicao) await apiService.request(`/categorias/${idEdicao}`, { method: 'PUT', body: JSON.stringify({ id: idEdicao, nome }) });
            else await apiService.request('/categorias', { method: 'POST', body: JSON.stringify({ nome }) });
            fecharModal(); carregarCategorias();
        } catch (err) { alert("Erro ao salvar categoria."); }
    }

    function prepararEdicao(cat: Categoria) { setIdEdicao(cat.id); setNome(cat.nome); setIsModalOpen(true); }
    function fecharModal() { setIsModalOpen(false); setIdEdicao(null); setNome(''); }

    async function confirmarExclusao() {
        if (!idParaExcluir) return;
        await apiService.request(`/categorias/${idParaExcluir}`, { method: 'DELETE' });
        setIdParaExcluir(null);
        carregarCategorias();
    }

    return (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <button onClick={() => setIsModalOpen(true)} style={{ padding: '12px 24px', backgroundColor: '#e60000', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginBottom: '30px', transition: '0.2s', boxShadow: '0 4px 12px rgba(230,0,0,0.2)' }}>
                <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> NOVA CATEGORIA
            </button>

            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {categorias.map((cat, index) => (
                    <div key={cat.id} className="card-hover animate-slide-up" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee', animationDelay: `${index * 0.05}s` }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#111' }}>
                            <i className="fa-solid fa-folder-open" style={{ color: '#e60000', marginRight: '8px' }}></i>{cat.nome}
                        </h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => prepararEdicao(cat)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#111', color: '#fff', cursor: 'pointer', transition: '0.2s' }}>Editar</button>
                            <button onClick={() => setIdParaExcluir(cat.id)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ffe5e5', backgroundColor: '#fff', color: '#e60000', cursor: 'pointer', transition: '0.2s' }}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Formulário */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ marginBottom: '20px' }}>{idEdicao ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                        <form onSubmit={handleSalvar}>
                            <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>Nome da Categoria</label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Ação, RPG..." />
                            <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 2, padding: '12px', backgroundColor: '#e60000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>SALVAR</button>
                                <button type="button" onClick={fecharModal} style={{ flex: 1, padding: '12px', backgroundColor: '#eee', color: '#444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>CANCELAR</button>
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
                            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '24px', color: '#e60000' }}></i>
                        </div>
                        <h2 style={{ marginBottom: '10px', fontSize: '20px' }}>Excluir Categoria?</h2>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>Esta ação é permanente e não poderá ser desfeita.</p>
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