const {Client} = require('@elastic/elasticsearch')

class MessageRepository {

    constructor() {
        this.client = new Client({
            node: 'https://search-ms-archive-db-dev-yv2dubb76zuwu72xveq7sw6x2a.eu-west-2.es.amazonaws.com',
            auth: {
                username: 'msarchive',
                password: 'Ac@&)]y9%3LT~r.q'
            }
        })
    }

    async search(index, query) {
        const {body} = await this.client.search({
            index,
            body: {
                query
            }
        })

        return body.hits.hits
    }
}

module.exports = MessageRepository
