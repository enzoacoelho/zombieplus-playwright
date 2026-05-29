import { expect } from '@playwright/test';
import { Toast } from './Components';

export class MoviesPage {

    constructor(page) {
        this.page = page
    }

    async isLoggedIn() {
        await this.page.waitForLoadState('networkidle')
        await expect(this.page).toHaveURL('http://localhost:3000/admin/movies')
    }

    async register(title, overview, company, releaseYear){

        await this.page.locator('a[href*="register"]').click()
        await expect(this.page).toHaveURL(/movies\/register/)

        const headerTitle = this.page.locator('header h1');
        await expect (headerTitle).toHaveText('Cadastrar novo Filme')

        await this.page.getByLabel('Titulo do filme').fill(title)
        await this.page.getByLabel('Sinopse').fill(overview)
       
        await this.page.locator('#select_company_id .react-select__indicators')
            .click()

        await this.page.locator('.react-select__option')
            .filter({hasText: company})
            .click()

        await this.page.locator('#select_year .react-select__indicator')
            .click()

        await this.page.locator('.react-select__option')
            .filter({hasText: releaseYear})
            .click()

        await this.page.getByRole('button', {name: 'Cadastrar'})
            .click()    

          
    }

    
}