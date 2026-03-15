import { useState } from "react"

import Login from "./pages/Boot/Login"
import Loading from "./pages/Boot/Loading"
import Sistema from "./pages/Sistema"

import audioGerenciador from "./utils/audioGerenciador"

const TELAS = { //apenas para organizar
  LOGIN: "login",
  LOADING: "loading",
  SISTEMA: "sistema"
}

export default function App(){
  const [tela, setTela] = useState(TELAS.LOGIN)

  const iniciarSistema = () => {
    audioGerenciador.ligarSistema()
    setTela(TELAS.LOADING)
  }

  return (
    <>
    <div className="efeitoRuidoDeTela"></div>
      {tela === TELAS.LOGIN && <Login iniciarSistema={iniciarSistema}/>}

      {tela === TELAS.LOADING && <Loading setTela={setTela} TELAS={TELAS}/>}

      {tela === TELAS.SISTEMA && <Sistema/>}
    </>
  )
}