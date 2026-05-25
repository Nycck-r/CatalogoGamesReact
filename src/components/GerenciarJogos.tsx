import React, { useState, useEffect } from 'react';
import { apiService } from '../apiService';
import { Classificacao } from '../types';
import type { Jogo, Categoria } from '../types';

export function GerenciarJogos() {
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [erro, setErro] = useState('');

    const [idEdicao, setIdEdicao] = useState<number | null>(null);
    const [titulo, setTitulo] = useState('');
    const [preco, setPreco] = useState(0);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [classificacao, setClassificacao] = useState<Classificacao>(Classificacao.Livre);
    const [categoriaId, setCategoriaId] = useState<number>(0);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const [listaJogos, listaCategorias] = await Promise.all([
                apiService.request('/jogos'),
                apiService.request('/categorias')
            ]);
            setJogos(listaJogos);
            setCategorias(listaCategorias);
            if (listaCategorias.length > 0 && !categoriaId) setCategoriaId(listaCategorias[0].id);
        } catch (err: any) {
            setErro("Erro ao sincronizar dados com o servidor.");
        }
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        const payload = { id: idEdicao || 0, titulo, precoOriginal: preco, anoLancamento: ano, classificacao, categoriaId };
        
        try {
            if (idEdicao) {
                await apiService.request(`/jogos/${idEdicao}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
            } else {
                await apiService.request('/jogos', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            }
            limparFormulario();
            carregarDados();
        } catch (err: any) {
            setErro(err.message || "Erro ao salvar o jogo.");
        }
    }

    function prepararEdicao(jogo: Jogo) {
        setIdEdicao(jogo.id);
        setTitulo(jogo.titulo);
        setPreco(jogo.precoOriginal);
        setAno(jogo.anoLancamento);
        setClassificacao(jogo.classificacao);
        setCategoriaId(jogo.categoriaId);
    }

    async function handleExcluir(id: number) {
        if (!confirm("Excluir este jogo permanentemente do catálogo?")) return;
        try {
            await apiService.request(`/jogos/${id}`, { method: 'DELETE' });
            carregarDados();
        } catch (err: any) {
            setErro(err.message || "Erro ao deletar jogo.");
        }
    }

    function limparFormulario() {
        setIdEdicao(null);
        setTitulo('');
        setPreco(0);
        setAno(new Date().getFullYear());
        setClassificacao(Classificacao.Livre);
        if (categorias.length > 0) setCategoriaId(categorias[0].id);
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <h3 style={{ marginTop: 0, borderBottom: '2px solid #008542', paddingBottom: '10px', color: '#333' }}>🎮 Catálogo de Jogos</h3>
            {erro && <p style={{ color: '#dc3545' }}>{erro}</p>}

            <form onSubmit={handleSalvar} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '30px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px', border: '1px solid #e3e3e3' }}>
                <h4 style={{ gridColumn: '1 / -1', margin: '0 0 5px 0', color: '#008542' }}>{idEdicao ? "✏️ Editar Cadastro" : "✨ Novo Registro"}</h4>
                <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="number" step="0.01" placeholder="Preço" value={preco} onChange={e => setPreco(Number(e.target.value))} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Ano" value={ano} onChange={e => setAno(Number(e.target.value))} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                
                <select value={classificacao} onChange={e => setClassificacao(Number(e.target.value))} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option value={Classificacao.Livre}>Livre</option>
                    <option value={Classificacao.DezAnos}>+10 Anos</option>
                    <option value={Classificacao.DozeAnos}>+12 Anos</option>
                    <option value={Classificacao.DezoitoAnos}>+18 Anos</option>
                </select>

                <select value={categoriaId} onChange={e => setCategoriaId(Number(e.target.value))} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', gridColumn: '1 / -1' }}>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#008542', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
                    {idEdicao && <button type="button" onClick={limparFormulario} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>}
                </div>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f1f1f1', borderBottom: '2px solid #008542' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#333' }}>Título</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#333' }}>Categoria</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#333' }}>Preço Base</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#333' }}>Com Desconto</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#333' }}>Idade</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#333' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {jogos.map(j => (
                        <tr key={j.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{j.titulo}</td>
                            <td style={{ padding: '10px' }}>{j.categoria || 'Sem Categoria'}</td>
                            <td style={{ padding: '10px' }}>R$ {j.precoOriginal.toFixed(2)}</td>
                            <td style={{ padding: '10px', color: '#008542', fontWeight: 'bold' }}>R$ {j.precoComDesconto?.toFixed(2)}</td>
                            <td style={{ padding: '10px' }}>{Classificacao[j.classificacao]}</td>
                            <td style={{ padding: '10px', textAlign: 'center', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                <button onClick={() => prepararEdicao(j)} style={{ backgroundColor: '#FFCD00', color: '#333', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Editar</button>
                                <button onClick={() => handleExcluir(j.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}