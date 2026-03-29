import "./styles/Gene.css"

export default function Gene({selecionado}){
  const stringGene = selecionado?.gene || ""
  const nucleotideos = stringGene.toUpperCase().split('')

  const copiarGene = () =>{
    navigator.clipboard.writeText(stringGene)
    alert("Gene copiado.")
  }

  const dicionarioImagensGene = {
    'A': '/assets/imgs/Genes/adenina.png',
    'T': '/assets/imgs/Genes/timina.png',
    'C': '/assets/imgs/Genes/citosina.png',
    'G': '/assets/imgs/Genes/guanina.png'
  }

  return(
    <main className="gene">
      <img
        src={selecionado?.imagem}
        alt={selecionado?.nome}
        className="dinoImagem"
      />

      <div className="containerGene">
        <h2 className="geneHeader">Exibindo gene de {selecionado.nome?.toUpperCase()}</h2>
        {nucleotideos.length > 0 ? (
          <>
            <div className="scrollDNA">
              {nucleotideos.map((letra, index) => (
                <div key={index} className="nucleotideoUnidade">
                  <img src={dicionarioImagensGene[letra]} alt={letra} />
                  <span className="letraGene">{letra}</span>
                </div>
              ))}
            </div>
            <div className="modificarGene">
              <button id="botaoCopiar" onClick={copiarGene}>
                Copiar Gene
              </button>
              <button id="botaoEditar">
                Editar Gene
              </button>
              <button id="botaoExcluir">
                Excluir Gene
              </button>
            </div>
          </>
        ) : (
          <div id="geneVazio">
            <p>Sequência genética nula.</p>
            <button id="adicionarGene">Adicionar Gene</button>
          </div>
        )}
      </div>
    </main>
  )
}