const { test, expect } = require('../support');
import { executeSQL }  from '../support/database';
const data = require ('../support/fixtures/movies.json');

test('deve poder cadastrar um novo filme', async ({ page }) => {
    const movie = data.create

    await executeSQL(`DELETE from movies WHERE title = '${movie.title}';`)

    //é preciso estar logado
    await page.login.visit()
    await page.login.submitLogin('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()

    await page.movies.register(movie.title, movie.overview, 'Netflix', movie.release_year)
    await page.toast.containText('Cadastro realizado com sucesso!') 

})