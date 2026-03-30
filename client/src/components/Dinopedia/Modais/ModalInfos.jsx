import {alerta} from "./Alertas"

import "../styles/Alertas.css"
import "../styles/Modais.css"

//FUNÇÃO DE EXCLUSÃO
const delEspecie = async (id, nome, fechar, setDinossauros) =>{
    const resultado = await alerta.fire({
      title: 'Exclusão solicitada.',
      text: `Deseja remover ${nome} da Dinopédia?`,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    })

    if (resultado.isConfirmed) {
      try{
        const res = await fetch(`http://localhost:3001/especies/${id}`, {
          method: "DELETE",
        })

        if (!res.ok){//response fora de [200-299]
          const errorData = await res.json()
          throw new Error(errorData.error || "Erro desconhecido.")//captura de erro ou mensagem genérica
        }

        //alerta o useMemo
        setDinossauros(prev => prev.filter(dino => dino.id !== id))

        alerta.fire({
          title: 'Operação bem-sucedida.',
          text: 'Espécie excluída da Dinopédia.',
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
}

//MODAL INFORMATIVO DE ESPÉCIES
export default function ModalInfos({abrirEdit, fechar, selecionado, setDinossauros}){
  if (!selecionado) return null

  return(
    <div className="modal">
      <div className="modalInfos" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={fechar}>
          ✕
        </button>

        <button id="editarEspecie" onClick={() => abrirEdit()}>
          Editar
        </button>

        <div className="dinoHeader">
          <p><strong>{selecionado.nome}</strong></p>
          <img
            src={selecionado.imagem}
            alt={selecionado.nome}
            className="dinoImagem"
          />
        </div>

        <div className="dinoInfo">
          <p><strong>Período:</strong> {selecionado.periodo}</p>
          <p><strong>Dieta:</strong> {selecionado.dieta}</p>
          <p><strong>Tamanho:</strong> {selecionado.tamanho}</p>
          <p><strong>Descrição:</strong> {selecionado.descricao}</p>
        </div>
        
        <div id="containerBotaoDelEspecie">
            <button 
                id="botaoDelEspecie" 
                onClick={() => delEspecie(selecionado.id, selecionado.nome, fechar, setDinossauros)}
            >
              Excluir Espécie
            </button>
        </div>
      </div>
    </div>
  )
}