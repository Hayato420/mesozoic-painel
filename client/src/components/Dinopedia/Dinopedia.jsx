import {useState, useEffect, useMemo} from "react"

import ModalAddEspecie from "./Modais/ModalAdd"
import ModalEditEspecie from "./Modais/ModalEdit"
import ModalInfos from "./Modais/ModalInfos"

import "./styles/Dinopedia.css"

export default function Dinopedia() {
  const [dinossauros, setDinossauros] = useState([])//serve para mostrar os dinossauros catalogados
  const [busca, setBusca] = useState("")//serve para pesquisar dinossauros na searchbar
  const [selecionado, setSelecionado] = useState(null)//serve para mostrar as informações da espécie selecionada, também servindo para excluí-la
  const [dinoEditando, setDinoEditando] = useState(null)//diz qual dino está sendo editado

  const [modal, setModal] = useState(null)
  const MODAIS ={
    ADD: "add",
    EDIT: "edit",
    INFOS: "infos"
  }

  const dinosFiltrados = useMemo(() => { //useMemo evita recalcular tudo toda vez, otimizando performance
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

  return (
    <div className="catalogo">

        <header className="headerCatalogo">
          <h2>Catálogo de Espécies</h2>
          <button onClick={() => setModal(MODAIS.ADD)}>
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
              onClick={() => {
                setSelecionado(dino)
                setModal(MODAIS.INFOS)
              }}
              className={selecionado?.id === dino.id ? "ativo" : ""}
            >
              {dino.nome}
            </button>
          ))}
        </div>

      {/*EXIBIÇÃO DOS MODAIS*/}
      {modal === MODAIS.ADD && <ModalAddEspecie
                                    fechar={() => setModal(null)}
                                    setDinossauros={setDinossauros}
                                  />}
      
      {modal === MODAIS.EDIT && <ModalEditEspecie
                                    fechar={() => {
                                      setModal(null)
                                      setDinoEditando(null)
                                    }}
                                    dinoEditando={dinoEditando} 
                                    setDinossauros={setDinossauros}
                                  />}
      
      {modal === MODAIS.INFOS && <ModalInfos 
                                      abrirEdit={() =>{
                                        setDinoEditando(selecionado)
                                        setModal(MODAIS.EDIT)
                                        setSelecionado(null)
                                      }}
                                      fechar={() => setModal(null)}
                                      selecionado={selecionado}
                                      setDinossauros={setDinossauros}
                                    />}
    </div>
  )
}