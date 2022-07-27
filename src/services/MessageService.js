const MessageRepository = require("../repositories/MessageRepository")

const MessageService = {
    getMessagesOfUser: (user) => {

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

        return MessageRepository.search(index, query)
    }
}

module.exports = MessageService
