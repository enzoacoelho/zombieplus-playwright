const { test, expect } = require('../support');
import { executeSQL } from '../support/database';
const data = require('../support/fixtures/movies.json');

test.beforeAll(async () => {
    await executeSQL(`DELETE from movies`)

})

test('deve poder cadastrar um novo filme', async ({ page }) => {
    const movie = data.create

    //é preciso estar logado
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.movies.create(movie)
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('não deve cadastrar quando o filme já está no catalogo', async ({ page, request }) => {
    const movie = data.duplicate

    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('não deve cadastrar sem preencher os campos obrigatórios', async ({ page }) => {
    //é preciso estar logado
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.movies.goForm()
    await page.movies.submit()

    await page.movies.alertHaveText([
        "Campo obrigatório",
        "Campo obrigatório",
        "Campo obrigatório",
        "Campo obrigatório"
    ])
})

test('deve remover um filme do catalogo', async ({ page, request }) => {
    const movie = data.to_remove
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.movies.remove(movie.title)
    await page.popup.haveText('Filme removido com sucesso.')


})

test('deve realizar busca por titulo existente no catalogo', async ({ page, request }) => {
    const movies = data.search

    movies.data.forEach(async (m) => {
        await request.api.postMovie(m)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.search(movies.input)

    await page.movies.tableHave(movies.outputs)
})

test('deve realizar busca por titulo não existente no catalogo', async ({ page, request }) => {

})