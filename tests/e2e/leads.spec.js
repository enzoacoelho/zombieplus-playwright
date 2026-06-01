const { test, expect } = require('../support');
import { faker } from '@faker-js/faker';

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';
  await page.toast.containText(message)

});

test('não deve cadastrar quando o email ja existe', async ({ page, request }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })

  expect(newLead.ok()).toBeTruthy()

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)

  const message = "O endereço de e-mail fornecido já está registrado em nossa fila de espera."
  await page.toast.containText(message)

});

test('não deve cadastrar com email invalido', async ({ page }) => {

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('Enzo Coelho', 'enzomail.com')

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

