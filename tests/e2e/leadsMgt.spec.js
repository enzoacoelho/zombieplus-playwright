const { test, expect } = require('../support');
const data = require('../support/fixtures/leads.json');
import { executeSQL } from '../support/database';
import { faker } from '@faker-js/faker';

test.beforeAll(async () => {
    await executeSQL(`DELETE from leads`)

})

test('deve realizar busca por um lead existente no gerenciamento de leads', async ({ page, request }) => {
    const leads = data.search

    for (const l of leads.data) {
        await request.api.postLeads(l)
    }

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.leadsmgt.search(leads.input)
    await page.leadsmgt.tableHave(leads.outputs)

});


test('deve realizar busca por lead não existente no gerenciamento de leads', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.leadsmgt.search("Anjo")

    await page.leadsmgt.shouldHaveNoResults('Nenhum lead encontrado!')
})

