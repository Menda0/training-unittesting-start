
class MessageService {

    constructor(repository) {
        this.repository = repository
    }

    getMessagesOfUser(user) {
        const index = "messages*"
        const query = {
            "bool": {
                "must": [
                    {
                        "match": {
                            user
                        }
                    }
                ]
            }
        }

        return this.repository.search(index, query)
    }
}

module.exports = MessageService
