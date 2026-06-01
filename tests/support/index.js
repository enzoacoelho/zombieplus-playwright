const { test: base, expect } = require('@playwright/test')
const { Api } = require('./api')

import { Login } from './actions/Login';
import { Movies } from './actions/Movies';
import { Toast } from './actions/Components';
import { Leads } from './actions/Leads';

const test = base.extend({
  page: async ({ page }, use) => {

    const context = page

    context['leads'] = new Leads(page)
    context['login'] = new Login(page)
    context['movies'] = new Movies(page)
    context['toast'] = new Toast(page)

    await use(context)
  },
  request: async ({ request }, use) => {
    const context = request

    context['api'] = new Api(request)

    await context['api'].setToken()

    await use(context)

  }
})

export { test, expect }