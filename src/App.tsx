import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddLivro from "./components/livro/add-livro.component"
import AddAluguel from "./components/aluguel/add-aluguel.component"
import LivroList from "./components/livro/livro-list.component"
import AluguelList from "./components/aluguel/aluguel-list.component";
class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/livro"} className="navbar-brand">
            Locação de livros          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/livro"} className="nav-link">
                Livros
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/aluguel"} className="nav-link">
                Histórico de aluguel
              </Link>
            </li>
          </div>
        </nav>
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<LivroList/>} />
            <Route path="/livro" element={<LivroList/>} />
            <Route path="/livro/add" element={<AddLivro/>} />
            <Route path="/aluguel/add" element={<AddAluguel/>} />
            <Route path="/aluguel" element={<AluguelList />} />
          </Routes>
        </div>
      </div>
    );
  }
}
export default App;