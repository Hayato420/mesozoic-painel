import {useState, useEffect, useRef} from "react"
import {alerta} from "../../Alertas"

import "../styles/Modais.css"

//FUNÇÃO DE EDIÇÃO
const editEspecie = async (novasInfos, id, fechar, setDinossauros) =>{
  try{
    const res = await fetch(`http://localhost:3001/especies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novasInfos)
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || "Erro desconhecido.")
    }

    const data = await res.json()
    setDinossauros(prev => prev.map(dino => dino.id === id ? data : dino))
    fechar()
    
    alerta.fire({
        title: 'Operação bem-sucedida.',
        text: 'Espécie editada.',
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })

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
export default function ModalEditEspecie({fechar, dinoEditando, dinossauros, setDinossauros}){
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

  //verifica se OUTRO dinossauro tem o nome da edição
  const nomeDuplicado = dinossauros.some(dino => 
      dino.nome.toLowerCase() === nome.trim().toLowerCase() && dino.id !== dinoEditando.id
    )

    if (nomeDuplicado){
      return alerta.fire({
              title: 'Operação malsucedida.',
              text: 'Já existe outra espécie com este nome.',
              showConfirmButton: true,
              confirmButtonText: 'Fechar'
            })
    }

    if (!nome.trim() || !periodo.trim() || !dieta.trim() || !tamanho.trim() || !descricao.trim() || !imagem.trim()) {
      return alerta.fire({
        title: 'Operação malsucedida.',
        text: 'Por favor, preencha todos os campos.',
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })
    }
  const infosEditadas = {nome, periodo, dieta, tamanho, descricao, imagem}


  if (!dinoEditando?.id){
    return
  }

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
          <input type="text" value={tamanho} onChange={(e) => setTamanho(e.target.value)} placeholder="Tamanho"/>
          <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição"/>

          <div className="selecaoImagem">
            <input type="file" ref={arquivoRef} onChange={escolhaDoArquivo} style={{ display: 'none' }} accept="image/*"/>
            <button type="button" onClick={handleBotaoClique}>Alterar Imagem</button>
            <p>{imagem || "Imagem não selecionada."}</p>
          </div>

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    </div>
  )
}