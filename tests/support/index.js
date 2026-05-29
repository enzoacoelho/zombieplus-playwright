const { test: base, expect } = require('@playwright/test')

import { LoginPage } from '../pages/LoginPage';
import { MoviesPage } from '../pages/MoviesPage';
import { Toast } from '../pages/Components';
import { LandingPage } from '../pages/LandingPage';

const test = base.extend({
    page: async ({page}, use) => {
        await use ({
            ...page,
            landing: new LandingPage(page),
            login: new LoginPage(page),
            movies: new MoviesPage(page),
            toast: new Toast(page)
        })
    }
})

export { test, expect }