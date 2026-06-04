const { test, expect } = require('../support');
const data = require('../support/fixtures/leads.json');
const users = require('../support/fixtures/users.json');
import { executeSQL } from '../support/database';

test.beforeAll(async () => {
    await executeSQL(`DELETE from leads`)

})

test('deve realizar busca por um lead existente no gerenciamento de leads', async ({ page, request }) => {
    const leads = data.search
    const admin = users.administrador

    for (const l of leads.data) {
        await request.api.postLeads(l)
    }

    await page.login.do(admin.email, admin.password, admin.name)
    await page.leadsmgt.search(leads.input)
    await page.leadsmgt.tableHave(leads.outputs)

});


test('deve realizar busca por lead não existente no gerenciamento de leads', async ({ page }) => {
    const admin = users.administrador
    await page.login.do(admin.email, admin.password, admin.name)
    await page.leadsmgt.search("Anjo")

    await page.leadsmgt.shouldHaveNoResults('Nenhum lead encontrado!')
})

