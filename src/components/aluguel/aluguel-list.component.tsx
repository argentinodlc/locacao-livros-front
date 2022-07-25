import { Component, ChangeEvent } from "react";
import AluguelService from "../../services/aluguel.service";
import IAluguel from '../../types/aluguel.type';

type Props = {};
type State = {
    alugueis: Array<IAluguel>,
    aluguelAtual: IAluguel | null,
    indexAtual: number
}
export default class AluguelList extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.carregarAlugueis = this.carregarAlugueis.bind(this);
        this.carregarAlugueisPorLivro = this.carregarAlugueisPorLivro.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.state = {
            alugueis: [],
            aluguelAtual: null,
            indexAtual: -1,
        };
    }
    componentDidMount() {
        let id = new URLSearchParams(window.location.search).get("id");
        if (id)
            this.carregarAlugueisPorLivro(id);
        else
            this.carregarAlugueis();
    }
    carregarAlugueis() {
        AluguelService.getAll()
            .then((response: any) => {
                this.setState({
                    alugueis: response.data
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    carregarAlugueisPorLivro(id: any) {
        AluguelService.get(id)
            .then((response: any) => {
                this.setState({
                    alugueis: response.data
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    refreshList() {
        this.carregarAlugueis();
        this.setState({
            aluguelAtual: null,
            indexAtual: -1
        });
    }
    setActiveAluguel(aluguel: IAluguel, index: number) {
        this.setState({
            aluguelAtual: aluguel,
            indexAtual: index
        });
    }


    render() {
        const { alugueis, aluguelAtual, indexAtual } = this.state;
        return (

            <div className="list row">
                <div className="col-md-8">
                    <h4>Histórico de aluguel</h4>
                </div>
                <div className="col-md-6">
                    <ul className="list-group">
                        {alugueis &&
                            alugueis.map((aluguel: IAluguel, index: number) => (
                                <li
                                    className={
                                        "list-group-item " +
                                        (index === indexAtual ? "active" : "")
                                    }
                                    onClick={() => this.setActiveAluguel(aluguel, index)}
                                    key={index}
                                >
                                    {aluguel.id} - {aluguel.livro?.titulo}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    {aluguelAtual && aluguelAtual.livro ? (
                        <div>
                            <h4> {aluguelAtual.livro?.titulo}</h4>
                            <div>
                                Alugado em {new Date(aluguelAtual.dataInicio).toLocaleDateString('en-GB')}
                            </div>
                            <div>
                               até {new Date(aluguelAtual.dataFim).toLocaleDateString('en-GB')}
                            </div>
                            { aluguelAtual.dataDevolucao && <div>
                                Devolvido em {new Date(aluguelAtual.dataDevolucao).toLocaleDateString('en-GB')}
                            </div> }
                            { aluguelAtual.dataDevolucao && new Date(new Date(aluguelAtual.dataDevolucao).toDateString()) > 
                            new Date(new Date(aluguelAtual.dataFim).toDateString()) && <div style={{ color: 'red'}}>
                                EM ATRASO
                            </div> } 
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