import { useState, useEffect, useMemo } from "react"

import { ModalInfos, ModalAddEspecies } from "./ModaisDinopedia"

import "../../styles/Dinopedia.css"

export default function Dinopedia() {
  const [dinossauros, setDinossauros] = useState([])
  const [busca, setBusca] = useState("")
  const [selecionado, setSelecionado] = useState(null)
  const [adicaoAberta, setAdicaoAberta] = useState(false)

  const adicionarDino = async (novoDino) => {
    try {
      const res = await fetch("http://localhost:3000/dinos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoDino)
      })
  
      const data = await res.json()
  
      setDinossauros(prev => [...prev, data])
    } catch (err) {
      console.error("Erro ao adicionar:", err)
    }
  }

  const dinosFiltrados = useMemo(() => { //useMemo evita recalcular tudo toda vez, otimizando performance
    return dinossauros
      .filter(dino =>
        (dino.nome || "").toLowerCase().includes(busca.toLowerCase())
      )
      .sort((a,b) => a.nome.localeCompare(b.nome, "pt"))
  }, [dinossauros, busca])

  useEffect(() => {
    async function carregarDinos(){
      try{
        const res = await fetch("http://localhost:3000/dinos")
        const data = await res.json()
        setDinossauros(data)
      } catch(err){
        console.error("Erro na busca de espécies: ", err)
      }
    }

    carregarDinos()
  }, [])

  return (
    <div className="catalogo">

        <header className="headerCatalogo">
          <h2>Catálogo de Espécies</h2>
          <button onClick={() => setAdicaoAberta(true)}>
            Adicionar
          </button>
        </header>

        <input className="barraPesquisa"
          type="text"
          placeholder="Insira a espécie para buscar"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className="listaEspecies">
          {dinosFiltrados.map(dino => (
            <button
              key={dino.id}
              onClick={() => setSelecionado(dino)}
              className={selecionado?.id === dino.id ? "ativo" : ""}
            >
              {dino.nome}
            </button>
          ))}
        </div>


      <ModalInfos
        selecionado={selecionado}
        fechar={() => setSelecionado(null)}
      />

      <ModalAddEspecies
        aberto={adicaoAberta}
        fechar={() => setAdicaoAberta(false)}
        especieAdicionada={adicionarDino}
      />

    </div>
  )
}