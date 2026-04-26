import {useState, useEffect, useMemo} from "react"

import BuscaEspecies from "../common/BuscaEspecies"
import Gene from "./Gene"
import "./styles/Laboratorio.css"

export default function Laboratorio(){
  const {dinossauros, setDinossauros, busca, setBusca, dinosFiltrados} = BuscaEspecies()
  const [selecionadoId, setSelecionadoId] = useState(null)

  //atualiza front após modif/add gene sem precisar recarregar a página
  const selecionado = useMemo(() =>{
    return dinossauros.find(dino => dino.id === selecionadoId) || null
  }, [dinossauros, selecionadoId])

  return(
    <div className="laboratorio">
      <header className="headerLaboratorio">
        <h1>Laboratório Genético</h1>
        <input className="barraPesquisaLaboratorio"
              type="text"
              placeholder="Insira a espécie para buscar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
        />
      </header>

      {selecionadoId === null ? (
        <div className="listaEspeciesGenes">
          {dinosFiltrados.map(dino => (
            <button 
              key={dino.id} 
              onClick={() => setSelecionadoId(dino.id)}>
              {dino.nome}
            </button>
          ))}
        </div>
      ) : (
        <section className="visualizadorGene">
          <button id="fecharGene" onClick={() => setSelecionadoId(null)}>Fechar</button>
          <Gene selecionado={selecionado} setDinossauros={setDinossauros}/>
        </section>
      )}
    </div>
  )
}