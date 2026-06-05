require('dotenv').config()

const { Pool } = require('pg')

const DbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT // Pode passar como número diretamente
}

// É melhor criar o pool FORA da função para reutilizar as conexões
const pool = new Pool(DbConfig)

export async function executeSQL(sqlScript) {
    let client; // Declaramos aqui fora para conseguir usar no 'finally'

    try {
        // 1. ADICIONADO O AWAIT: Agora 'client' é o cliente real de conexão
        client = await pool.connect()

        const result = await client.query(sqlScript)
        return result.rows // Boa prática retornar o resultado em vez de só dar log

    } catch (error) {
        console.log('Erro ao executar o SQL ' + error)
        throw error // Repassa o erro para quem chamou a função saber que falhou

    } finally {
        // 2. LIBERAÇÃO DA CONEXÃO: Executa SEMPRE, dando certo ou dando erro
        if (client) {
            client.release()
        }
    }
}