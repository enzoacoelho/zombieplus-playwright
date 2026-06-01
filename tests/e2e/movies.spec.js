const { test, expect } = require('../support');
import { executeSQL }  from '../support/database';
const data = require ('../support/fixtures/movies.json');

test.beforeAll( async () => {
    await executeSQL(`DELETE from movies`)

})

test('deve poder cadastrar um novo filme', async ({ page }) => {
    const movie = data.create   

    //é preciso estar logado
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.movies.create(movie)
    await page.toast.containText('Cadastro realizado com sucesso!') 
})

test('não deve cadastrar quando o filme já está no catalogo', async ({ page, request }) => {
    const movie = data.duplicate
    
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    await page.toast.containText('Este conteúdo já encontra-se cadastrado no catálogo') 
})

test('não deve cadastrar sem preencher os campos obrigatórios', async ({page}) => {
    //é preciso estar logado
     await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.movies.goForm()
    await page.movies.submit()

    await page.movies.alertHaveText([
        'Por favor, informe o título.',
        'Por favor, informe a sinopse.',
        'Por favor, informe a empresa distribuidora.',
        'Por favor, informe o ano de lançamento.'
    ])

})