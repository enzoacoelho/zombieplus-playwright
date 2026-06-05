require('dotenv').config()

const { expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

export class Api {

    constructor(request) {
        this.baseApi = process.env.BASE_API
        this.request = request
        this.token = undefined
    }

    async setToken() {
        const response = await this.request.post(this.baseApi + '/sessions', {
            data: {
                email: 'admin@zombieplus.com',
                password: 'pwd123'
            }
        })
        expect(response.ok()).toBeTruthy()
        const body = JSON.parse(await response.text())
        this.token = 'Bearer ' + body.token
    }

    async getCompanyByName(companyName) {

        const response = await this.request.get(this.baseApi +  '/companies', {
            headers: {
                Authorization: this.token
            },
            params: {
                name: companyName
            }

        })

        expect(response.ok()).toBeTruthy()
        const body = JSON.parse(await response.text())
        return body.data[0].id

    }

    async postMovie(movie) {
        const companyId = await this.getCompanyByName(movie.company)
        const imagePath = path.resolve(__dirname, '..', 'fixtures', `.${movie.cover}`);

        const response = await this.request.post(this.baseApi + '/movies', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: companyId,
                release_year: movie.release_year,
                featured: movie.featured,
                cover: fs.createReadStream(imagePath)
            }
        })

        expect(response.ok()).toBeTruthy()

    }

    async postTvShow(tvShow) {
        const companyId = await this.getCompanyByName(tvShow.company)
        const imagePath = path.resolve(__dirname, '..', 'fixtures', `.${tvShow.cover}`);

        const response = await this.request.post(this.baseApi + '/tvshows', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: tvShow.title,
                overview: tvShow.overview,
                company_id: companyId,
                release_year: tvShow.release_year,
                featured: tvShow.featured,
                seasons: tvShow.seasons,
                cover: fs.createReadStream(imagePath)
            }
        })

        expect(response.ok()).toBeTruthy()

    }

    async postLeads(lead) {
        const response = await this.request.post(this.baseApi + '/leads', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            data: {
                name: lead.name,
                email: lead.email,
            }
        })

        expect(response.ok()).toBeTruthy()

    }
}