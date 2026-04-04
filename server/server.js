const express = require('express')
const PORT = 3001
const { Pool } = require('pg')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

//reutlização da conexão
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
})

app.get('/especies', async (_, res) =>{
  try{
    const {rows} = await pool.query('SELECT * FROM especies ORDER BY id DESC')
    res.status(200).json(rows)
  } catch (err){
    res.status(500).json({error: "Erro interno."})
  }
})

app.post('/especies', async (req, res) =>{
  const {nome, periodo, dieta, tamanho, descricao, imagem} = req.body
  try{

    const query = 'INSERT INTO especies (nome, periodo, dieta, tamanho, descricao, imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
    const values = [nome, periodo, dieta, tamanho, descricao, imagem]
    const {rows} = await pool.query(query, values)

    res.status(201).json(rows[0])

  } catch (err){
    if (err.code === '23505'){//23505->violação de unicidade, nome já existe
      return res.status(400).json({ error: "Esta espécie já foi catalogada." })
    }
    res.status(500).json({ error: "Erro interno ao salvar espécie." })
  }
})

app.patch('/especies/:id', async (req, res) =>{
  const {id} = req.params
  const fields = req.body

  try {
    if (Object.keys(fields).length === 0){
      return res.status(400).json({error: "Preencha algum campo para atualizar."})
    }

    const setClauses = []
    const values = []
    let index = 1

    for (const key in fields){
      setClauses.push(`${key} = $${index}`)
      values.push(fields[key])
      index++
    }

    values.push(id)

    const query = `UPDATE especies SET ${setClauses.join(', ')} WHERE id = $${index} RETURNING *`
    
    const { rows } = await pool.query(query, values)

    if (rows.length === 0){
      return res.status(404).json({error: "Espécie não encontrada."})
    }

    res.status(200).json(rows[0])

  } catch (err){
    if (err.code === '23505'){//23505->violação de unicidade, nome já existe
      return res.status(400).json({ error: "Outra espécie já possui este nome." })
    }
    res.status(500).json({error: "Erro interno ao atualizar."})
  }
})

app.patch('/especies/:id', async (req, res) =>{
  const {id} = req.params
  const fields = req.body

  //evita req maliciosa direta para a API
  if (fields.gene !== undefined){
    const geneParaValidar = fields.gene.toUpperCase().trim()
    const regexGene = /^[ATCG]*$/

    if (!regexGene.test(geneParaValidar)){
      return res.status(400).json({ 
        error: "Sequência genética inválida. Use apenas A, T, C e G." 
      })
    }
  }

  try{
    if (!fields || Object.keys(fields).length === 0){
      return res.status(400).json({error: "Preencha algum campo para atualizar."})
    }

    const setClauses = []
    const values = []
    let index = 1

    for (const key in fields){
      if (Object.prototype.hasOwnProperty.call(fields, key)){
        let valor = fields[key]

        if (key === 'gene' && (valor === null || valor === undefined)){
          valor = ""
        }

        setClauses.push(`${key} = $${index}`)
        values.push(valor)
        index++
      }
    }

    values.push(id)

    const query = `
      UPDATE especies
      SET ${setClauses.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `

    const {rows} = await pool.query(query, values)

    if (rows.length === 0){
      return res.status(404).json({error: "Espécie não encontrada."})
    }

    res.status(200).json(rows[0])

  } catch (err){
    res.status(500).json({ error: err.message })
  }
})

app.delete('/especies/:id', async (req, res) =>{
  const {id} = req.params
  try{

    const {rows} = await pool.query('DELETE FROM especies WHERE id = $1 RETURNING *', [id])

    if (rows.length === 0){ //id não encontrado
      return res.status(404).send('Espécie não encontrada.')
    }

    res.status(200).json(rows[0])

  } catch (err){
    res.status(500).json({error: "Erro interno."})
  }
})

app.listen(PORT)