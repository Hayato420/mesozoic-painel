import {useState, useEffect} from "react"
import {alerta} from "../common/Alertas/Alertas"

import "./styles/ModificacoesGenes.css"

const API_URL = import.meta.env.VITE_API_URL

const validarGene = (sequencia) =>{
  const regex = /^[ATCG]*$/
  return regex.test(sequencia.toUpperCase())
}

const alterarGene = async (geneEditado, selecionadoID, setDinossauros) =>{
  //validação do gene por garantia
  if (!validarGene(geneEditado.gene)) {
    return alerta.fire({
      title: 'Sequência Inválida',
      text: 'O gene deve conter apenas as bases nitrogenadas: A, T, C, G.',
    })
  }

  try {
    const res = await fetch(`${API_URL}/especies/${selecionadoID}`,{
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(geneEditado)
    })

    if (res.ok){
      const data = await res.json() //novas informações do dinossauro (incluindo o gene editado) retornadas pela API
      setDinossauros(prev => prev.map(dino => dino.id === selecionadoID ? data : dino)) //atualização dos genes na tela sem precisar recarregar
      alerta.fire({
          title: 'Operação bem-sucedida.',
          text: geneEditado.gene === "" ? 'Gene excluído.' : 'Novo Gene salvo.',
          showConfirmButton: true,
          confirmButtonText: 'Fechar'
      })
    }
  } catch (err){
    alerta.fire({
        title: 'Operação malsucedida.',
        text: err.message,
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
    })
  }
}

//MODAL DE MODIFICAR GENE
export function ModalModifGene({fechar, selecionado, setDinossauros}){
  const [gene, setGene] = useState("")

  //autopreenchimento
  useEffect(() =>{
    if (selecionado){
      setGene(selecionado.gene || "")
    }
  }, [selecionado])

  if (!selecionado) return null

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const geneEditado = {gene: gene.toUpperCase().trim() }

    await alterarGene(geneEditado, selecionado.id, setDinossauros)
    fechar()
  }

  return(
    <div className="modal">
      <div className="modalModifGene" onClick={(e) => e.stopPropagation()}>
        <button className="fecharModifGene" onClick={fechar}>Fechar</button>

        <form onSubmit={handleSubmit} className="formularioModifGene">
          <h2>Modificar Gene de {selecionado.nome}</h2>

          <input 
            type="text" 
            value={gene} 
            onChange={(e) => {
              const upperCased = e.target.value.toUpperCase().trim()//maiúsculas automaticamente, por garantia
              const apenasATCG = upperCased.replace(/[^ATCG]/g, '')//filtra outras letras postas por engano
              setGene(apenasATCG)
            }} 
            placeholder="Insira o novo Gene (A,T,C,G)"
          />

          <button type="submit">Salvar Alterações</button>
        </form>

        <button 
          type="button" 
          onClick={async () =>{
            alerta.fire({
              title: 'Confirmação de exclusão.',
              text: "Isso apagará todo o Gene da espécie.",
              showCancelButton: true,
              confirmButtonText: 'Confirmar',
              cancelButtonText: 'Cancelar'
            }).then(async (result) =>{
              if (result.isConfirmed) {
                await alterarGene({gene: "" }, selecionado.id, setDinossauros)
                fechar()
              }
            })
          }}
        >
          Excluir Gene
        </button>

      </div>
    </div>
  )
}

//MODAL DE ADD GENE
export function ModalAddGene({fechar, selecionado, setDinossauros}){
  const [gene, setGene] = useState("")

  if (!selecionado) return null

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const geneAdicionado = {gene: gene.toUpperCase().trim() }

    await alterarGene(geneAdicionado, selecionado.id, setDinossauros)
    fechar()
  }

  return(
    <div className="modal">
      <div className="modalAddGene" onClick={(e) => e.stopPropagation()}>
        <button className="fecharAddGene" onClick={fechar}>Fechar</button>

        <form onSubmit={handleSubmit} className="formularioAddGene">
          <h2>Adicionar Gene de {selecionado.nome}</h2>

          <input 
            type="text" 
            value={gene} 
            onChange={(e) => {
              const upperCased = e.target.value.toUpperCase().trim()//maiúsculas automaticamente, por garantia
              const apenasATCG = upperCased.replace(/[^ATCG]/g, '')//filtra outras letras postas por engano
              setGene(apenasATCG)
            }} 
            placeholder="Insira o novo Gene (A,T,C,G)"
          />

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    </div>
  )
}