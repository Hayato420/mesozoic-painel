import {useState, useEffect, useMemo} from "react"

import BuscaEspecies from "../common/BuscaEspecies"
import ModalAddEspecie from "./Modais/ModalAdd"
import ModalEditEspecie from "./Modais/ModalEdit"
import ModalInfos from "./Modais/ModalInfos"

import "./styles/Dinopedia.css"

export default function Dinopedia(){
  const {dinossauros, setDinossauros, busca, setBusca, dinosFiltrados} = BuscaEspecies()
  const [selecionado, setSelecionado] = useState(null)//serve para mostrar as informações da espécie selecionada, também servindo para excluí-la
  const [dinoEditando, setDinoEditando] = useState(null)//diz qual dino está sendo editado

  const [modal, setModal] = useState(null)
  const MODAIS ={
    ADD: "add",
    EDIT: "edit",
    INFOS: "infos"
  }

  return(
    <div className="catalogo">

        <header className="headerCatalogo">
          <h1>Catálogo de Espécies</h1>

          <button onClick={() => setModal(MODAIS.ADD)}>
            Adicionar
          </button>

          <input className="barraPesquisaDinopedia"
            type="text"
            placeholder="Insira a espécie para buscar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </header>
        <div className="listaEspeciesDinopedia">
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
                                    dinossauros={dinossauros}
                                    setDinossauros={setDinossauros}
                                  />}
      
      {modal === MODAIS.EDIT && <ModalEditEspecie
                                    fechar={() => {
                                      setModal(null)
                                      setDinoEditando(null)
                                    }}
                                    dinoEditando={dinoEditando}
                                    dinossauros={dinossauros}
                                    setDinossauros={setDinossauros}
                                  />}
      
      {modal === MODAIS.INFOS && <ModalInfos 
                                      abrirEdit={() =>{
                                        setDinoEditando(selecionado)
                                        setModal(MODAIS.EDIT)
                                        setSelecionado(null)
                                      }}
                                      fechar={() => {
                                        setModal(null)
                                        setSelecionado(null)
                                      }}
                                      selecionado={selecionado}
                                      setDinossauros={setDinossauros}
                                    />}
    </div>
  )
}