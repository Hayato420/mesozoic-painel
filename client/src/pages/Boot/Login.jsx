import "../../styles/Boot.css"

export default function Login({iniciarSistema}){
    return(
        <div className="boot login" onClick={iniciarSistema}>
          <h1>MESOZOIC PAINEL</h1>
          <p className="blink">Clique em qualquer lugar para iniciar</p>
        </div>
    )
}