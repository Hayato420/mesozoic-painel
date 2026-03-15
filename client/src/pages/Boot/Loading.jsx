import { useState, useEffect } from "react"
import "../../styles/Boot.css"

const textosDeCarregamento = [
  "Carregando Dinopédia",
  "Sincronizando informações de DNA",
  "Carregando informações de recintos",
  "Carregando câmeras",
  "Inicializando sistemas"
]

export default function Loading({setTela, TELAS}){

  const [textoIndex, setTextoIndex] = useState(0)
  const [pontos, setPontos] = useState("")

  //Troca frases de loading
  useEffect(() => {

    if (textoIndex < textosDeCarregamento.length - 1){
      const timer = setTimeout(() => {
        setTextoIndex(prev => prev + 1)
      }, 2000)

      return () => clearTimeout(timer)
    }

    else{
      const timer = setTimeout(() => {
        setTela(TELAS.SISTEMA)
      }, 2000)

      return () => clearTimeout(timer)
    }

  }, [textoIndex])

  //Anima os '...'
  useEffect(() => {

    const intervalo = setInterval(() => {
      setPontos(prev => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(intervalo)

  }, [])

  return(
    <div className="boot loading">
      <p>
        {textosDeCarregamento[textoIndex]}
        {pontos}
      </p>
    </div>
  )
}