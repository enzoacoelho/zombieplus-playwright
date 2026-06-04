const { test: base, expect } = require('@playwright/test')
const { Api } = require('./api')

import { Login } from './actions/Login';
import { Movies } from './actions/Movies';
import { TvShows } from './actions/TvShows';
import { Popup } from './actions/Components';
import { Leads } from './actions/Leads';
import { LeadsMgt } from './actions/LeadsMgt';

const test = base.extend({
  page: async ({ page }, use) => {

    const context = page

    context['leads'] = new Leads(page)
    context['leadsmgt'] = new LeadsMgt(page)
    context['login'] = new Login(page)
    context['movies'] = new Movies(page)
    context['tvshows'] = new TvShows(page)
    context['popup'] = new Popup(page)

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