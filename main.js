const Neos = require('@bombitmanbomb/neosjs')
const express = require("express")

const info = require("./logger").info
const neos = new Neos()
const app = express()

let itemMap = new Map()

const api = app.listen(3000, () => info("API OK"))
app.get("/item", (req, res) => {
    if(!req.query.q) {
        res.status(400).send("NO_ATTACHED_QUERY")
        return
    }
    const item = itemMap.get(req.query.q)
    if(!item) {
        res.status(400).send("ITEM_NOT_FOUND")
    }
    res.send(item)
})

neos.on("login", (obj) => {
    // console.log(obj.CurrentUser, obj.CurrentSession) // Log the current user and Session
})
neos.on("friendAdded", (friend) => {
    if (friend.FriendStatus === "Requested") {
        neos.AddFriend(friend) // Accept the Friend Request
    }
    // console.log(friend) //New Friend
})


neos.on("messageReceived", (message) => {
    try {
        const pMsg = JSON.parse(message.Content)
        if(!pMsg.assetUri) {
            // text
            info("Message Received :?")
            neos.SendTextMessage(message.SenderId,"Error: can't get ItemURL")
        } else {
            info("Message Received :item")
            const itemID = generateItemID().toString()
            itemMap.set(itemID,pMsg.assetUri)
            neos.SendTextMessage(message.SenderId,"OTT is :" + itemID)
            setTimeout(() => {
                itemMap.delete(itemID)
            },60 * 1000 * 5)
        }
    } catch (e) {
        info("Message Received :text")
        neos.SendTextMessage(message.SenderId, "hello world!")
    }
    // console.log(message.Content)
    // neos.SendTextMessage(message.SenderId, message.Content) // Reply recieved message back
})

function generateItemID() {
    const date = new Date()
    const mills = date.getMilliseconds()
    return mills
}


neos.Login(process.env.NEOS_ID, process.env.NEOS_PASS)