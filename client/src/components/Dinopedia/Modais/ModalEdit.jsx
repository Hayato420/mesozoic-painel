import {useState, useEffect, useRef} from "react"
import {alerta} from "./Alertas"

import "../styles/Alertas.css"
import "../styles/Modais.css"

//FUNÇÃO DE EDIÇÃO
const editEspecie = async (novasInfos, id, fechar, setDinossauros) =>{
      try {
        const res = await fetch(`http://localhost:3001/especies/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novasInfos)
        })

        const data = await res.json()

        if (!res.ok){//response fora de [200-299]
          throw new Error(data.error || "Erro desconhecido.")//captura de erro ou mensagem genérica
        }

        setDinossauros(prev => prev.map(dino => dino.id === id ? data : dino))//atualização da lista, caso mexa no nome

        alerta.fire({
          title: 'Operação bem-sucedida.',
          text: 'Informações da espécie editadas.',
          showConfirmButton: true,
          confirmButtonText: 'Fechar'
        })
        fechar()

      } catch (err){
        alerta.fire({
          title: 'Operação malsucedida.',
          text: err.message,
          showConfirmButton: true,
          confirmButtonText: 'Fechar'
        })
      }
}

//MODAL EDITIVO DE ESPÉCIES
export default function ModalEditEspecie({fechar, dinoEditando, setDinossauros}){
  const [nome, setNome] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [dieta, setDieta] = useState("")
  const [tamanho, setTamanho] = useState("")
  const [descricao, setDescricao] = useState("")
  const [imagem, setImagem] = useState("")

  const arquivoRef = useRef(null)

  //autopreenchimento
  useEffect(() =>{
    if (dinoEditando){
      setNome(dinoEditando.nome || "")
      setPeriodo(dinoEditando.periodo || "")
      setDieta(dinoEditando.dieta || "")
      setTamanho(dinoEditando.tamanho || "")
      setDescricao(dinoEditando.descricao || "")
      setImagem(dinoEditando.imagem || "")
    }
  }, [dinoEditando])

  if (!dinoEditando) return null


  const handleSubmit = async (e) =>{
    e.preventDefault()

    const infosEditadas = {nome, periodo, dieta, tamanho, descricao, imagem}

    await editEspecie(infosEditadas, dinoEditando.id, fechar, setDinossauros)
  }

  const handleBotaoClique = () => arquivoRef.current.click()

  const escolhaDoArquivo = (e) => {
    const arquivo = e.target.files[0]
    if (arquivo) {
      setImagem(`/assets/imgs/Dinopedia/${arquivo.name}`)
    }
  }

  return (
    <div className="modal">
      <div className="modalAddEditEspecie" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={fechar}>✕</button>

        <form onSubmit={handleSubmit} className="formularioAddEditDino">
          <h2>Editar {dinoEditando.nome}</h2>
          
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
          <input type="text" value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="Período" />
          <input type="text" value={dieta} onChange={(e) => setDieta(e.target.value)} placeholder="Dieta" />
          <input type="text" value={tamanho} onChange={(e) => setTamanho(e.target.value)} placeholder="Tamanho" />
          <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Insira a DESCRIÇÃO da espécie"/>

          <div className="selecaoImagem">
            <input type="file" ref={arquivoRef} onChange={escolhaDoArquivo} style={{ display: 'none' }} accept="image/*" />
            <button type="button" onClick={handleBotaoClique}>Alterar Imagem</button>
            <p>{imagem || "Imagem não selecionada."}</p>
          </div>

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    </div>
  )
}