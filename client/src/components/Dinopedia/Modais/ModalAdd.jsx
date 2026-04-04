import {useState, useRef} from "react"
import {alerta} from "../../Alertas"

import "../styles/Modais.css"

//FUNÇÃO DE ADIÇÃO
const addEspecie = async (novoDino, fechar, setDinossauros) =>{
    try {
      const res = await fetch("http://localhost:3001/especies",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoDino)
      })
  
      const data = await res.json()

      if (!res.ok){//response fora de [200-299]
        throw new Error(data.error || "Erro desconhecido.")//captura de erro ou mensagem genérica
      }

      fechar()

      //alerta o useMemo
      setDinossauros(prev => [...prev, data])//atualiza catálogo exibido para incluir a nova espécie
      alerta.fire({
        title: 'Operação bem-sucedida.',
        text: 'Espécie adicionada à Dinopédia.',
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

//MODAL ADITIVO DE ESPÉCIES
export default function ModalAddEspecie({fechar, dinossauros, setDinossauros}){
  const [nome, setNome] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [dieta, setDieta] = useState("")
  const [tamanho, setTamanho] = useState("")
  const [descricao, setDescricao] = useState("")
  const [imagem, setImagem] = useState("")

  //REFERÊNCIA PARA SELEÇÃO DE IMAGEM, DEVE SER RETIRADA NO ELECTRON
  const arquivoRef = useRef(null)

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const nomeExiste = dinossauros.some(
      (dino) => dino.nome.toLowerCase() === nome.toLowerCase()
    )

    if (nomeExiste){
      return alerta.fire({
        title: 'Nome duplicado!',
        text: 'Já existe uma espécie cadastrada com este nome.',
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })
    }

    if (
        !nome.trim() ||
        !periodo.trim() ||
        !dieta.trim() ||
        !tamanho.trim() ||
        !descricao.trim() ||
        !imagem.trim()
    ) {
        return
    }

    const novoDino ={
      nome,
      periodo,
      dieta,
      tamanho,
      descricao,
      imagem
    }

    await addEspecie(novoDino, fechar, setDinossauros)

    //limpeza do formulario
    setNome("")
    setPeriodo("")
    setDieta("")
    setTamanho("")
    setDescricao("")
    setImagem("")
  }

  //LÓGICA DA SELEÇÃO DE IMAGEM, DEVE SER RETIRADA NO ELECTRON
  const handleBotaoClique = () => arquivoRef.current.click()//botão bonito "cobre" o feio, e chama o feio quando clicado

  const escolhaDoArquivo = (e) => {
    const arquivo = e.target.files[0]//pega só o primeiro
    if (arquivo){
      setImagem(`/assets/imgs/Dinopedia/${arquivo.name}`)//o usuário tem que pôr o arquivo manualmente na pasta, no Electron será mais fácil
    }
  }

  return(
    <div className="modal">
      <div className="modalAddEditEspecie" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={fechar}>
          ✕
        </button>

        <form onSubmit={handleSubmit} className="formularioAddEditDino">
          <h2>Adicionar Espécie</h2>
          <input type="text" placeholder="Insira o NOME da espécie" value={nome} onChange={(e) => setNome(e.target.value)}/>
          <input type="text" placeholder="Insira o PERÍODO da espécie" value={periodo} onChange={(e) => setPeriodo(e.target.value)}/>
          <input type="text" placeholder="Insira a DIETA da espécie" value={dieta} onChange={(e) => setDieta(e.target.value)}/>
          <input type="text" placeholder="Insira o TAMANHO da espécie" value={tamanho} onChange={(e) => setTamanho(e.target.value)}/>
          <input type="text" placeholder="Insira a DESCRIÇÃO da espécie" value={descricao} onChange={(e) => setDescricao(e.target.value)}/>

          <div className="selecaoImagem">
            <input type="file" ref={arquivoRef}  onChange={escolhaDoArquivo} style={{display: 'none'}}/*esconde feiura*/ accept="image/*"/>
            <button type="button" onClick={handleBotaoClique}>
              Selecione a imagem
            </button>
            <p>{imagem || "Imagem não selecionada."}</p>
          </div>

          <button type="submit">
            Salvar
          </button>
        </form>
      </div>  
    </div>
  )
}