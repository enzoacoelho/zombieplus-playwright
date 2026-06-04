const { test, expect } = require('../support');
const data = require('../support/fixtures/users.json');

test('deve fazer login como administrador', async ({ page }) => {
    const user = data.administrador

    await page.login.visit()
    await page.login.submitLogin(user.email, user.password)
    await page.login.isLoggedIn(user.name)
});

test('não deve logar com senha incorreta', async ({ page }) => {
    await page.login.visit()
    await page.login.submitLogin('admin@zombieplus.com', 'pwd1234')

    const message = "Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente."

    await page.popup.haveText(message)

});

test('não deve logar com email incorreto', async ({ page }) => {
    await page.login.visit()
    await page.login.submitLogin('admin3@zombieplus.com', 'pwd123')

    const message = "Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente."

    await page.popup.haveText(message)

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