'use strict'

const Web3 = require('web3')
const testWeb3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

require('dotenv').config()

const devKey = process.env['DEVELOPMENT_PKEY']

const testBroker = testWeb3.eth.coinbase
module.exports = {
    deploy: [
        'Depay'
    ],
    networks: {
        test: {
            web3: testWeb3
        },
        development: {
            web3: testWeb3,
            url: 'http://localhost:8545',
            txOptions: {
                gas: 6000000,
                gasPrice: 20e9,
                from: testWeb3.eth.coinbase
            }
        },
        kovan: {
            privateKey: devKey,
            url: process.env['DEPLOY_KEY'],
            txOptions: {
                gas: 6500000,
                gasPrice: 30e9,
                from: '0x2cE8525bFb35fd3959FBe0E37b77Fd5D69Db45AE'
            }
        },
        main: {
            privateKey: process.env['DEPLOY_KEY'],
            url: process.env['MAIN_URL'],
            txOptions: {
                gas: 4000000,
                gasPrice: 10e9,
                from: '0x2cE8525bFb35fd3959FBe0E37b77Fd5D69Db45AE'
            }
        }
    }
}
