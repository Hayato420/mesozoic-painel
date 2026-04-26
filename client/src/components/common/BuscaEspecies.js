import {useState, useEffect, useMemo} from 'react'
//DRY, EXIBE ESPECIES COM SEARCHBAR, ATUALIZANDO EFICIENTEMENTE AS ALTERAÇÕES (useMemo)
export default function BuscaEspecies(){
  const [dinossauros, setDinossauros] = useState([])
  const [busca, setBusca] = useState("")

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() =>{
    async function carregarDinos(){
      try{
        const res = await fetch(`${API_URL}/especies`)
        const data = await res.json()
        setDinossauros(data)
      } catch (err){
        console.error("Erro na busca de espécies: ", err)
      }
    }

    carregarDinos()
  }, [API_URL])

  const dinosFiltrados = useMemo(() =>{
    return (Array.isArray(dinossauros) ? dinossauros : [])
      .filter(dino => (dino.nome || "").toLowerCase().includes(busca.toLowerCase()))
  }, [dinossauros, busca])

  return {dinossauros, setDinossauros, busca, setBusca, dinosFiltrados}
}