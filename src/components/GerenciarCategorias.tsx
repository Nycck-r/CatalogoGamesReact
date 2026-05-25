import React, { useState, useEffect } from 'react';
import { apiService } from '../apiService';
import type { Categoria } from '../types';

export function GerenciarCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [novoNome, setNovoNome] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarCategorias();
    }, []);

    async function carregarCategorias() {
        try {
            const dados = await apiService.request('/categorias');
            setCategorias(dados);
        } catch (err: any) {
            setErro("Erro ao carregar categorias do banco.");
        }
    }

    async function handleCriar(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        try {
            await apiService.request('/categorias', {
                method: 'POST',
                body: JSON.stringify({ nome: novoNome })
            });
            setNovoNome('');
            carregarCategorias();
        } catch (err: any) {
            setErro(err.message || "Não foi possível criar a categoria.");
        }
    }

    async function handleExcluir(id: number) {
        if (!confirm("Deseja realmente excluir esta categoria?")) return;
        setErro('');
        try {
            await apiService.request(`/categorias/${id}`, { method: 'DELETE' });
            carregarCategorias();
        } catch (err: any) {
            setErro(err.message || "Erro ao excluir. Verifique se existem jogos vinculados.");
        }
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <h3 style={{ marginTop: 0, borderBottom: '2px solid #008542', paddingBottom: '10px', color: '#333' }}>📁 Categorias</h3>
            {erro && <p style={{ color: '#dc3545', fontSize: '14px' }}>{erro}</p>}
            
            <form onSubmit={handleCriar} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Nova Categoria" value={novoNome} onChange={e => setNovoNome(e.target.value)} style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }} required />
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#008542', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add</button>
            </form>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {categorias.map(cat => (
                    <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <span>{cat.nome} <small style={{ color: '#888' }}>(ID: {cat.id})</small></span>
                        <button onClick={() => handleExcluir(cat.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}