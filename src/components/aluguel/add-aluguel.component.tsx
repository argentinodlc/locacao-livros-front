import { Component } from "react";
import { Link } from "react-router-dom";
import LivroService from "../../services/livro.service";
import AluguelService from "../../services/aluguel.service";
import IAluguel from '../../types/aluguel.type';
import DatePicker from 'react-date-picker';
import ILivro from "../../types/livro.type";
type Props = {};
type State = IAluguel & {
    submitted: boolean
};

export default class AddAluguel extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeDataInicio = this.onChangeDataInicio.bind(this);
        this.onChangeDataFim = this.onChangeDataFim.bind(this);
        this.getLivro = this.getLivro.bind(this);
        this.saveAluguel = this.saveAluguel.bind(this);
        this.state = {
            id: null,
            dataInicio: new Date(),
            dataFim: new Date(),
            dataDevolucao: null,
            livro: null,
            submitted: false
        };
    }

    componentDidMount() {
        let id = new URLSearchParams(window.location.search).get("id");
        if (id) {
            this.getLivro(id)
        }
    }

    onChangeDataInicio(date: any) {
        this.setState({
            dataInicio: date
        });
    }
    onChangeDataFim(date: any) {
        this.setState({
            dataFim: date
        });
    }

    saveAluguel() {
        const data: IAluguel = {
            dataInicio: this.state.dataInicio,
            dataFim: this.state.dataFim,
            livro: this.state.livro
        };
        const livro: ILivro = {
            id: this.state.livro?.id,
            titulo: this.state.livro?.titulo ? this.state.livro.titulo : "",
            sinopse: this.state.livro?.sinopse ? this.state.livro.sinopse : "",
            autor: this.state.livro?.autor ? this.state.livro.autor : "",
            alugado: true
        };
        AluguelService.create(data)
            .then((response: any) => {
                console.log("CREATE")
                this.setState({
                    id: response.data.id,
                    dataInicio: new Date(response.data.dataInicio),
                    dataFim: new Date(response.data.dataFim),
                    dataDevolucao: response.data.dataDevolucao
                });
                console.log(response.data);
                this.saveLivro(livro)
            })
            .catch((e: Error) => {
                console.log(e);
            });

    }

    saveLivro(livro: ILivro) {
        LivroService.update(livro, livro.id).
            then((response: any) => {
                this.setState({
                    livro: response.data,
                    submitted: true
                })
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    getLivro(id: any) {
        LivroService.get(id)
            .then((response: any) => {
                this.setState({
                    livro: response.data
                })
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    render() {
        const { submitted, dataInicio, dataFim, livro } = this.state;
        return (
            <div className="submit-form">
                {submitted ? (
                    <div>
                        <h4>Livro alugado com sucesso!</h4>
                        <Link to={"/livro"} className="nav-link">
                            Voltar
                        </Link>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="dataInicio">Data Início</label> <br />
                                <DatePicker
                                    onChange={this.onChangeDataInicio}
                                    value={dataInicio}
                                    format="dd/MM/yyyy"
                                    minDate={new Date()} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dataFim">Data Fim</label>
                                <br />
                                <DatePicker
                                    onChange={this.onChangeDataFim}
                                    value={dataFim}
                                    format="dd/MM/yyyy"
                                    minDate={dataInicio} />
                            </div>
                            <button onClick={this.saveAluguel} disabled={!dataInicio || !dataFim} className="btn btn-success">
                                Salvar
                            </button>
                        </div>
                        <div className="col-md-6">
                            <div>
                                <h4> {livro?.titulo}</h4>
                                <div>
                                    Por {livro?.autor}
                                </div>
                                <div>
                                    {livro?.sinopse}
                                </div>
                                <div style={{ color: livro?.alugado ? 'red' : 'green' }}>
                                    {livro?.alugado ? "Alugado" : "Disponível para locação"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}