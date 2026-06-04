import { expect } from '@playwright/test';

export class LeadsMgt {

    constructor(page) {
        this.page = page
    }

    async visit() {
        await this.page.goto('http://localhost:3000/admin/leads')
    }

    async search(target) {
        await this.visit()
        await this.page.getByPlaceholder('Busque pelo email')
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


}