import { Component, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LivroService from "../../services/livro.service";
import ILivro from '../../types/livro.type';
type Props = {};
type State = ILivro & {
  submitted: boolean
};

export default class AddLivro extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeSinopse = this.onChangeSinopse.bind(this);
    this.onChangeAutor = this.onChangeAutor.bind(this);
    this.saveLivro = this.saveLivro.bind(this);
    this.newLivro = this.newLivro.bind(this);
    this.state = {
      id: null,
      titulo: "",
      sinopse: "",
      autor: "",
      alugado: false,
      submitted: false
    };
  }

  componentDidMount() {
    let id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      this.getLivro(id)
    }
  }

  onChangeTitulo(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      titulo: e.target.value
    });
  }
  onChangeSinopse(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      sinopse: e.target.value
    });
  }
  onChangeAutor(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      autor: e.target.value
    })
  }

  saveLivro() {
    const data: ILivro = {
      titulo: this.state.titulo,
      sinopse: this.state.sinopse,
      autor: this.state.autor,
      alugado: this.state.alugado
    };
    if (this.state.id) {
      LivroService.update(data, this.state.id).
        then((response: any) => {
          this.setState({
            id: response.data.id,
            titulo: response.data.titulo,
            sinopse: response.data.sinopse,
            autor: response.data.autor,
            alugado: response.data.alugado,
            submitted: true
          });
          console.log(response.data);
        })
        .catch((e: Error) => {
          console.log(e);
        });
    } else {
      LivroService.create(data)
        .then((response: any) => {
          this.setState({
            id: response.data.id,
            titulo: response.data.titulo,
            sinopse: response.data.sinopse,
            autor: response.data.autor,
            alugado: response.data.alugado,
            submitted: true
          });
          console.log(response.data);
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }
  }
  getLivro(id: any) {
    LivroService.get(id)
      .then((response: any) => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          sinopse: response.data.sinopse,
          autor: response.data.autor,
          alugado: response.data.alugado,
          submitted: false
        })
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  newLivro() {
    this.setState({
      id: null,
      titulo: "",
      sinopse: "",
      autor: "",
      alugado: false,
      submitted: false
    });
  }
  render() {
    const { submitted, titulo, autor, sinopse } = this.state;
    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>Livro salvo com sucesso!</h4>
            <Link to={"/livro"} className="nav-link">
              Voltar
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="titulo">Titulo</label>
              <input
                type="text"
                className="form-control"
                id="titulo"
                required
                value={titulo}
                onChange={this.onChangeTitulo}
                name="titulo"
              />
            </div>
            <div className="form-group">
              <label htmlFor="autor">Autor</label>
              <input
                type="text"
                className="form-control"
                id="autor"
                required
                value={autor}
                onChange={this.onChangeAutor}
                name="autor"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sinopse">Sinopse</label>
              <input
                type="text"
                className="form-control"
                id="sinopse"
                required
                value={sinopse}
                onChange={this.onChangeSinopse}
                name="sinopse"
              />
            </div>
            <button onClick={this.saveLivro} disabled={!titulo || !autor || !sinopse} className="btn btn-success">
              Salvar
            </button>
          </div>
        )}
      </div>
    );
  }
}