import http from "../http-common";
import IAluguel from "../types/aluguel.type"
class AluguelService {
  getAll() {
    return http.get<Array<IAluguel>>("/aluguel");
  }
  get(id: string) {
    return http.get<IAluguel>(`/aluguel/${id}`);
  }
  create(data: IAluguel) {
    return http.post<IAluguel>("/aluguel", data);
  }
  update(id: any) {
    return http.put<any>(`/aluguel/${id}`);
  }
  delete(id: any) {
    return http.delete<any>(`/aluguel/${id}`);
  }
}
export default new AluguelService();