import {useState, useEffect, useMemo} from "react"

import Gene from "./Gene"
import "./styles/Laboratorio.css"

export default function Laboratorio(){
  const [dinossauros, setDinossauros] = useState([])
  const [busca, setBusca] = useState("")
  const [selecionadoId, setSelecionadoId] = useState(null)

  const dinosFiltrados = useMemo(() =>{
    return (Array.isArray(dinossauros) ? dinossauros : [])
      .filter(dino => (dino.nome || "").toLowerCase().includes(busca.toLowerCase()))
  }, [dinossauros, busca])

  const selecionado = useMemo(() =>{ //atualiza modificações de Gene sem recarregar
    return dinossauros.find(dino => dino.id === selecionadoId) || null;
  }, [dinossauros, selecionadoId])

  useEffect(() =>{
    async function carregarDinos(){
      try{
        const res = await fetch("http://localhost:3001/especies")
        const data = await res.json()
        setDinossauros(data)
      } catch(err){
        console.error("Erro na busca de espécies: ", err)
      }
    }

    carregarDinos()
  }, [])

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

      {selecionado === null ? (
        <div className="listaEspeciesGenes">
          {dinosFiltrados.map(dino => (
            <button key={dino.id} onClick={() => setSelecionadoId(dino.id)}>
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