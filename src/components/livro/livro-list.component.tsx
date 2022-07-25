import { Component, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LivroService from "../../services/livro.service";
import AluguelService from "../../services/aluguel.service";
import ILivro from '../../types/livro.type';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

type Props = {};
type State = {
    livros: Array<ILivro>,
    livroAtual: ILivro | null,
    indexAtual: number,
    titulo: string,
    admin: boolean
};
export default class LivroList extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.onChangeTitulo = this.onChangeTitulo.bind(this);
        this.carregarLivros = this.carregarLivros.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveLivro = this.setActiveLivro.bind(this);
        this.searchTitle = this.searchTitle.bind(this);
        this.state = {
            livros: [],
            livroAtual: null,
            indexAtual: -1,
            titulo: "",
            admin: false
        };
    }
    componentDidMount() {
        this.carregarLivros();
    }
    onChangeTitulo(e: ChangeEvent<HTMLInputElement>) {
        const titulo = e.target.value;
        this.setState({
            titulo: titulo
        });
    }
    carregarLivros() {
        LivroService.getAll()
            .then((response: any) => {
                this.setState({
                    livros: response.data
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }
    refreshList() {
        this.carregarLivros();
        this.setState({
            livroAtual: null,
            indexAtual: -1
        });
    }
    setActiveLivro(livro: ILivro, index: number) {
        this.setState({
            livroAtual: livro,
            indexAtual: index
        });
    }
    searchTitle() {
        this.setState({
            livroAtual: null,
            indexAtual: -1
        });
        LivroService.findByTitulo(this.state.titulo)
            .then((response: any) => {
                this.setState({
                    livros: response.data
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }
    deleteLivro(livro: ILivro) {
        LivroService.delete(livro.id)
            .then((response: any) => {
                console.log(response.data);
                this.refreshList()
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }
    devolverLivro(livro: ILivro) {
        livro.alugado = false
        AluguelService.update(livro.id).
            then((response: any) => {
                console.log("Devolver")
                LivroService.update(livro, livro.id).
                    then((response: any) => {
                        this.refreshList();
                        console.log(response.data);
                    })
                    .catch((e: Error) => {
                        console.log(e);
                    });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }
    setAdmin(e: boolean) {
        this.setState({
            admin: e
        })
    }
    render() {
        const { titulo, livros, livroAtual, indexAtual, admin } = this.state;
        return (

            <div className="list row">
                <div className="col-md-8">
                    <h4>Livros</h4>
                </div>
                <div className="col-md-7">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar pelo título"
                            value={titulo}
                            onChange={this.onChangeTitulo}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={this.searchTitle}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
                {admin && <div className="col-md-2">
                    <Link className="btn btn-success" to={"/livro/add"}>
                        Novo
                    </Link>
                </div>}
                <div className="col-md-2">
                    <BootstrapSwitchButton
                        width={150}
                        checked={admin}
                        onlabel='Administrador'
                        offlabel='Usuário comum'
                        onChange={(e) => this.setAdmin(e)}
                    />
                </div>
                <div className="col-md-6">
                    <ul className="list-group">
                        {livros &&
                            livros.map((livro: ILivro, index: number) => (
                                <li
                                    className={
                                        "list-group-item " +
                                        (index === indexAtual ? "active" : "")
                                    }
                                    onClick={() => this.setActiveLivro(livro, index)}
                                    key={index}
                                >
                                    {livro.titulo}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    {livroAtual ? (
                        <div>
                            <h4> {livroAtual.titulo}</h4>
                            <div>
                                Por {livroAtual.autor}
                            </div>
                            <div>
                                {livroAtual.sinopse}
                            </div>
                            <div style={{ color: livroAtual.alugado ? 'red' : 'green' }}>
                                {livroAtual.alugado ? "Alugado" : "Disponível para locação"}
                            </div>
                            {!livroAtual.alugado && <Link
                                to={"/aluguel/add?id=" + livroAtual.id}
                                className="badge badge-primary mr-2"
                            >
                                Alugar
                            </Link>}
                            {livroAtual.alugado && <Link
                                to={""}
                                className="badge badge-primary mr-2"
                                onClick={() => this.devolverLivro(livroAtual)}
                            >
                                Devolver
                            </Link>}
                            { admin && <Link
                                to={"/aluguel?id=" + livroAtual.id}
                                className="badge badge-secondary mr-2"
                            >
                                Ver histórico
                            </Link>}
                            { admin && <Link
                                to={"/livro/add?id=" + livroAtual.id}
                                className="badge badge-warning mr-2"
                            >
                                Editar
                            </Link>}
                            { admin && <Link
                                to={""}
                                className="badge badge-danger"
                                onClick={() => this.deleteLivro(livroAtual)}
                            >
                                Excluir
                            </Link> }
                        </div>
                    ) : (
                        <div>
                        </div>
                    )}
                </div>
            </div>
        );

    }
}