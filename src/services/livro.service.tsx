import http from "../http-common";
import ILivro from "../types/livro.type"
class LivroService {
  getAll() {
    return http.get<Array<ILivro>>("/livro");
  }
  get(id: string) {
    return http.get<ILivro>(`/livro/${id}`);
  }
  create(data: ILivro) {
    return http.post<ILivro>("/livro", data);
  }
  update(data: ILivro, id: any) {
    return http.put<any>(`/livro/${id}`, data);
  }
  delete(id: any) {
    return http.delete<any>(`/livro/${id}`);
  }
  findByAlugado() {
    return http.get<Array<ILivro>>(`/livro?/alugado`);
  }
  findByTitulo(titulo: string) {
    return http.get<Array<ILivro>>(`/livro?titulo=${titulo}`);
  }
}
export default new LivroService();