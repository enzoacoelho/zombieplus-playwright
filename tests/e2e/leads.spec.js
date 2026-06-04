const { test, expect } = require('../support');
const data = require('../support/fixtures/leads.json');
import { executeSQL } from '../support/database';
import { faker } from '@faker-js/faker';

test.beforeAll(async () => {
    await executeSQL(`DELETE from leads`)

})

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const lead = data.create
 
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(lead.name, lead.email)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.';
  await page.popup.haveText(message)

});

test('não deve cadastrar quando o email ja existe', async ({ page, request }) => {
  const lead = data.duplicate

  await request.api.postLeads(lead)

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(lead.name, lead.email)

  const message = "Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços."
  await page.popup.haveText(message)

});

test('não deve cadastrar com email invalido', async ({ page }) => {
  const lead = data.invalidEmail

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(lead.name, lead.email)

  await page.leads.alertHaveText('Email incorreto')

});

test('não deve cadastrar com email vazio', async ({ page }) => {

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('Enzo Coelho', '')

  await page.leads.alertHaveText('Campo obrigatório');

});

test('não deve cadastrar com nome vazio', async ({ page }) => {

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', 'enzo@mail.com')

  await page.leads.alertHaveText('Campo obrigatório');

});

test('não deve cadastrar com todos os campos vazios', async ({ page }) => {

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', '')

  await page.leads.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ]);

});

