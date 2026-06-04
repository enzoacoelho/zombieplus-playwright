const { test, expect } = require('../support');
import { executeSQL } from '../support/database';
const data = require('../support/fixtures/tvshows.json');

test.beforeAll(async () => {
    await executeSQL(`DELETE from tvshows`)

})

test('deve poder cadastrar uma nova serie', async ({ page }) => {
    const serie = data.create

    //é preciso estar logado
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.tvshows.create(serie)
    await page.popup.haveText(`A série '${serie.title}' foi adicionada ao catálogo.`)
})

test('não deve cadastrar quando a série já está no catalogo', async ({ page, request }) => {
    const serie = data.duplicate

    await request.api.postTvShow(serie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(serie)
   
    await page.popup.haveText(`O título '${serie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('não deve cadastrar sem preencher os campos obrigatórios', async ({ page }) => {
    //é preciso estar logado
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.tvshows.goForm()
    await page.tvshows.submit()

    await page.tvshows.alertHaveText([
        "Campo obrigatório",
        "Campo obrigatório",
        "Campo obrigatório",
        "Campo obrigatório",
        "Campo obrigatório (apenas números)"
    ])
})

test('deve remover uma série do catalogo', async ({ page, request }) => {
    const serie = data.to_remove
    await request.api.postTvShow(serie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.tvshows.remove(serie.title)
    await page.popup.haveText('Série removida com sucesso.')


})

test('deve realizar busca por titulo no catalogo', async ({ page, request }) => {
    const series = data.search
    
    for (const s of series.data) {
        await request.api.postTvShow(s)
    }

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.search(series.input)

    await page.tvshows.tableHave(series.outputs)
})

test('deve realizar busca por titulo não existente no catalogo', async ({ page, request }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.search("Anjo")

    await page.tvshows.shouldHaveNoResults('Nenhum registro encontrado!')

})