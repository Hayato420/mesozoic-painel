import {useState, useEffect, useMemo} from "react"

import Gene from "./Gene"
import "./styles/Laboratorio.css"

export default function Laboratorio(){
  const [dinossauros, setDinossauros] = useState([])
  const [busca, setBusca] = useState("")
  const [selecionado, setSelecionado] = useState(null)

  const dinosFiltrados = useMemo(() =>{ //useMemo evita recalcular tudo toda vez, otimizando performance
    return (Array.isArray(dinossauros) ? dinossauros : [])
            .filter(dino => (dino.nome || "").toLowerCase().includes(busca.toLowerCase()))
  }, [dinossauros, busca])

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
      <h1>Laboratório Genético</h1>

      {selecionado === null ? (
        <div className="listaEspeciesGenes">
          {dinosFiltrados.map(dino => (
            <button key={dino.id} onClick={() => setSelecionado(dino)}>
              {dino.nome}
            </button>
          ))}
        </div>
      ) : (
        <section className="visualizadorGene">
          <button id="fecharGene" onClick={() => setSelecionado(null)}>Fechar</button>
          <Gene selecionado={selecionado}/>
        </section>
      )}
    </div>
  )
}