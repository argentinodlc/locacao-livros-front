import ILivro from "./livro.type";

export default interface IAluguel {
    id?: any | null,
    dataInicio: Date,
    dataFim: Date,
    dataDevolucao?: Date | null,
    livro: ILivro  | null,
  }