import { expect } from '@playwright/test';

export class TvShows {

    constructor(page) {
        this.page = page
    }

    async visit() {
        await this.page.goto('http://localhost:3000/admin/tvshows')
    }

    async goForm() {
        await this.visit()
        await this.page.locator('a[href*="register"]').click()
        await expect(this.page).toHaveURL(/tvshows\/register/)

        const headerTitle = this.page.locator('header h1');
        await expect(headerTitle).toHaveText('Cadastrar nova Série')
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' })
            .click()
    }

    async create(tvshow) {

        await this.goForm()

        await this.page.getByLabel('Titulo da série').fill(tvshow.title)
        await this.page.getByLabel('Sinopse').fill(tvshow.overview)

        await this.page.locator('#select_company_id .react-select__indicators')
            .click()

        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.company })
            .click()

        await this.page.locator('#select_year .react-select__indicator')
            .click()

        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.release_year })
            .click()

        await this.page.getByLabel('Temporadas').fill(tvshow.seasons.toString())

        await this.page.locator('input[name=cover]')
            .setInputFiles('tests/support/fixtures' + tvshow.cover)

        if (tvshow.featured) {
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submit()

    }

    async remove(title) {
        //vai pro catalogo
        await this.visit()

        //pega a linha correta do filme
        await this.page.getByRole('row', { name: title })
            .getByRole('button').click()

        //confirmar exclusao  
        await this.page.locator('.confirm-removal')
            .click()
    }

    async search(target) {
        await this.visit()
        await this.page.getByPlaceholder('Busque pelo nome')
            .fill(target)

        await this.page.click('.actions button')
    }

    async tableHave(content) {
        const rows = this.page.getByRole('row')
        await expect(rows).toContainText(content)
    }

    async shouldHaveNoResults(message) {
        const messageLocator = this.page.getByText(message)
        await expect(messageLocator).toBeVisible()
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target);

    }

}