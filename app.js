const config = require('./config.json')
const fetch = require('node-fetch')
const colors = require('colors')
const tgbotapi = require('telegram-bot-api')

const tgbot = new tgbotapi({
    token: config.token,
    updates: {
        enabled: true
    }
})

function writelog(e, a, b, c, d){
    let time = '['+(new Date()).toLocaleTimeString('en-US', { hour12: false })+']'
    let tag = '[' + e + ']'
    if(e == "NMSG") console.log(time.cyan, tag.green, 'from', b.magenta, '(', a, ')')
    else if(e == "INFO") console.log(time.cyan, tag.green, a)
    else if(e== "MSG") console.log(time.cyan, tag.green, a.magenta + ' : ' + b)
}

tgbot.on('message', msg => {
    if(!msg.text)return
    let command = msg.text.split(' ')
    console.log(msg)
    if(command[0] === "/market"){
        if(command[1].toLowerCase() === "yobit"){
            let url = 'https://yobit.net/api/2/' + command[2].toLowerCase() + '_btc/ticker'
            fetch(url).then(res => res.json()).then(json => {
                console.log(json)
                json = json['ticker']
                let text = "Market " + command[2].toUpperCase() + " to BTC @ yobit:"
                text += "\nLast: " + json['last']
                text += "\nBuy: " + json['buy']
                text += "\nSell: " + json['sell']
                text += "\nHigh: " + json['high']
                text += "\nLow: " + json['low']
                text += "\nVolume: " + json['vol']
                tgbot.sendMessage({
                    chat_id: msg['from']['id'],
                    text: text
                })
            })
        }
    }
})
