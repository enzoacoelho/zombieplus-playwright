const { test, expect } = require('../support');
import { LoginPage } from '../pages/LoginPage';
import { MoviesPage } from '../pages/MoviesPage';
import { Toast } from '../pages/Components';


test('deve fazer login como administrador', async ({ page }) => {
    await page.login.visit()
    await page.login.submitLogin('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()

});

test('não deve logar com senha incorreta', async ({ page }) => {
    await page.login.visit()
    await page.login.submitLogin('admin@zombieplus.com', 'pwd1234')

    const message = "Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente."

    await page.toast.containText(message)

});

test('não deve logar com email incorreto', async ({ page }) => {
    await page.login.visit()
    await page.login.submitLogin('admin3@zombieplus.com', 'pwd123')

    const message = "Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente."

    await page.toast.containText(message)

});

test('não deve logar com email vazio', async ({ page }) => {
    await page.login.visit()
    await page.login.submitLogin('', 'pwd123')
    await page.login.alertHaveText('Campo obrigatório')  
});

test('não deve logar com senha vazia', async ({ page }) => {
    await page.login.visit()
    await page.login.submitLogin('admin3@zombieplus.com', '')
    await page.login.alertHaveText('Campo obrigatório')  
});

test('não deve logar com todos os campos vazios', async ({ page }) => {
    await page.login.visit()
    await page.login.submitLogin('', '')
    await page.login.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])  
});