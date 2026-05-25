export enum Classificacao {
    Livre = 0,
    DezAnos = 10,
    DozeAnos = 12,
    DezoitoAnos = 18
}

export interface Categoria {
    id: number;
    nome: string;
    jogos?: Jogo[];
}

export interface Jogo {
    id: number;
    titulo: string;
    precoOriginal: number;
    precoComDesconto?: number;
    anoLancamento: number;
    classificacao: Classificacao;
    categoriaId: number;
    categoria?: string;
}