const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")

chai.should()
chai.use(sinonChai)

const {expect} = require("chai")

const {Client} = require('@elastic/elasticsearch')
const MessageService = require("../services/MessageService")
const MessageRepository = require("../repositories/MessageRepository")
const MessagesServiceV2 = require("../services/MessageServiceV2")
const MessageRepositoryV2 = require("../repositories/MessageRepositoryV2")

const EXPECTED_RESULT1 = [
    {
        "_index": "messages-anubis-202207.22",
        "_type": "_doc",
        "_id": "<CAHM8pLyDKnEY6j33deErtt+s712b1ds_p9Af1_nvUUmHNvNw=Q@mail.gmail.com>::70604f03fa1a10::Rupeal::1658503349000::dmeloj@gmail.com",
        "_score": 1.7509375,
        "_source": {
            "userId": "af0347c5-11c2-4edf-9c94-140c3980411f",
            "user": "dmeloj@gmail.com",
            "domain": "gmail.com",
            "organization": "Anubis",
            "to": [
                {
                    "address": "daniel.madureira@rupeal.com",
                    "name": ""
                }
            ],
            "from": [
                {
                    "address": "dmeloj@gmail.com",
                    "name": "Diego Jacomel"
                }
            ],
            "cc": [
                {
                    "address": "dmeloj@gmail.com",
                    "name": "Diego Jacomel"
                },
                {
                    "address": "email@diegoteste.pt",
                    "name": ""
                }
            ],
            "subject": "Testing CC",
            "text": "CC\n",
            "sendDate": 1658503349000,
            "indexDate": 1658829414695,
            "status": "AVAILABLE",
            "availability": "AVAILABLE",
            "location": "https://ms-archive-storage.s3.eu-west-2.amazonaws.com/%3CCAHM8pLyDKnEY6j33deErtt%2Bs712b1ds_p9Af1_nvUUmHNvNw%3DQ%40mail.gmail.com%3E%3A%3A70604f03fa1a10%3A%3ARupeal%3A%3A1658503349000",
            "etag": "\"78fbe66205bca5878624fd78e262078c\"",
            "size": 0,
            "attachments": [],
            "file": "<CAHM8pLyDKnEY6j33deErtt+s712b1ds_p9Af1_nvUUmHNvNw=Q@mail.gmail.com>::70604f03fa1a10::Rupeal::1658503349000"
        }
    },
    {
        "_index": "messages-anubis-202207.22",
        "_type": "_doc",
        "_id": "<CAHM8pLzohSo7-k+-HyOhg_XqgJYivnEaA1RDCan1QMA+X_8RfA@mail.gmail.com>::70604f03fa1a10::Anubis::1658496625000::dmeloj@gmail.com",
        "_score": 1.7509375,
        "_source": {
            "userId": "af0347c5-11c2-4edf-9c94-140c3980411f",
            "user": "dmeloj@gmail.com",
            "domain": "gmail.com",
            "organization": "Anubis",
            "to": [
                {
                    "address": "dmeloj@gmail.com",
                    "name": "Diego Jacomel"
                }
            ],
            "from": [
                {
                    "address": "dmeloj@gmail.com",
                    "name": "Diego Jacomel"
                }
            ],
            "cc": [
                {
                    "address": "email@diegoteste.pt",
                    "name": ""
                }
            ],
            "subject": "Test cc",
            "text": "Test cc\n",
            "sendDate": 1658496625000,
            "indexDate": 1658829455718,
            "status": "AVAILABLE",
            "availability": "AVAILABLE",
            "location": "https://ms-archive-storage.s3.eu-west-2.amazonaws.com/%3CCAHM8pLzohSo7-k%2B-HyOhg_XqgJYivnEaA1RDCan1QMA%2BX_8RfA%40mail.gmail.com%3E%3A%3A70604f03fa1a10%3A%3AAnubis%3A%3A1658496625000",
            "etag": "\"e7a47dc0c03011a652783160485582a1\"",
            "size": 0,
            "attachments": [],
            "file": "<CAHM8pLzohSo7-k+-HyOhg_XqgJYivnEaA1RDCan1QMA+X_8RfA@mail.gmail.com>::70604f03fa1a10::Anubis::1658496625000"
        }
    }
]

describe('Testing messages repository', () =>{
    it('Test if unit test are working', () => {
        expect(true)
    })

    afterEach('Restore stubs', () =>{
        sinon.restore()
    })

    // This is an integration test.
    // We are not creating any mock so the unit test will preform an elastic search on the index.
    // However if the index is modified of simply unavailable that test will result in an error.
    // Unit test must be independent of third party system.
    // The main objective of unit testing is to test the business logic. We don't need to test the connection to the
    // database, api, or other third party services.
    // In this case we want to test if can get dmeloj@gmail.com messages from elastic
    it('Testing if message service can get message of user', async () => {
        const messages = await MessageService.getMessagesOfUser("dmeloj@gmail.com")

        expect(messages).not.to.be.empty
        expect(messages.length).to.be.equal(6)
    })

    it('Testing if service can get messages from user', async () => {

        const user = "someuser"

        // const stub = sinon.stub(MessageRepository, "search").resolves(EXPECTED_RESULT1)
        // const messages = await MessageService.getMessagesOfUser(user)

        const stub = sinon.spy(MessageRepository, "search")
        await MessageService.getMessagesOfUser(user)

        // expect(messages).not.to.be.empty
        // expect(messages.length).to.be.equal(2)

        const [index, query] = stub.getCall(0).args
        expect(index).to.be.equal("messages*")
        expect(query.bool.must[0].match.user).to.be.equal(user)
    })

    it('Testing if service class can get messages from user', async () => {

        const user = "someuser"

        const repository = sinon.stub(MessageRepositoryV2, "search").resolves(EXPECTED_RESULT1)

        //const repository = new MessageRepositoryV2()
        const service = new MessagesServiceV2(repository)

        const messages = await service.getMessagesOfUser(user)

        expect(messages).not.to.be.empty
        expect(messages.length).to.be.equal(2)

        const [index, query] = repository.getCall(0).args
        expect(index).to.be.equal("messages*")
        expect(query.bool.must[0].match.user).to.be.equal(user)
    })
})
