const fs = require('fs');
const Discord = require('discord.js');
const queryString = require('querystring');
const r2 = require('r2');

const client = new Discord.Client();

const { d_token } = require('./config.json');
const { cat_token } = require('./config.json');
const CAT_API_URL = "https://api.thecatapi.com/"

const buildVersion = process.env.npm_package_version;

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
});

client.on('error', data => {
    console.log('error', data);
    // attempt reconnection x times, after x seconds, exponential backoff
});

let catData = fs.readFileSync('status_save.json');
var catStatus = JSON.parse(catData);

client.login(d_token);

var dict = {
    "help": helpCommand,
    "meow": meowCommand,
    "pints": pintsCommand,
    "git": gitCommand,
    "status": statusCommand,
    "save": saveCommand,
    "feed": feedCommand,
    "level": levelCommand
};

// var catStatus = {
//     "hunger": 50,
//     "fun": 50,
//     "luvToUsers": [
//         { "userName": "user1", "luvs": 50 },
//         { "userName": "user2", "luvs": 50 },
//     ]
// };

var catTimer = setInterval(function () { catActivity(); }, 900000);
var autoSaveStats = setInterval(function () { saveProgress(); }, 900000);
var autoGetHungry = setInterval(function () { getHungry(); }, 400000);
var autoMinusLuvs = setInterval(function () { minusLuvs(); }, 900000);

function catActivity() {
    var catArray = ['opt1', 'opt2', 'opt3', 'opt4', 'opt5'];
    var randAct = catArray[Math.floor(Math.random() * catArray.length)];
    switch (randAct) {
        case "opt1":
            client.user.setActivity("", { type: "" })
            break;
        case "opt2":
            client.user.setActivity("Catflix", { type: "Watching" })
            break;
        case "opt3":
            client.user.setActivity("MeowCraft III", { type: "Playing" })
            break;
        case "opt4":
            client.user.setActivity("", { type: "" })
            break;
        case "opt5":
            client.user.setActivity("Jingle Cats", { type: "Listening" })
            break;
    }
}

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }
    if (receivedMessage.content == "!meow") {
        processCommand(receivedMessage)
    }
    else if (receivedMessage.content.startsWith("!") && receivedMessage.content.includes(client.user.toString())) {
        processCommand(receivedMessage)
    }
    else if (receivedMessage.content.includes(client.user.toString())) {
        meowReact(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    searhCommand(receivedMessage, primaryCommand, arguments);

}

function searhCommand(receivedMessage, primaryCommand, arguments) {
    if (primaryCommand in dict) {
        dict[primaryCommand](receivedMessage);
    }
    else {
        receivedMessage.channel.send("I don't understand the command. Try `!help`")
    }
}

function helpCommand(receivedMessage) {
    console.log(Object.keys(dict));
    receivedMessage.channel.send("`Captain Cat` - Currently running version: `CAT." + buildVersion + "`" + "\n" + "\n" + "Available Commands @Capt. Cat :" + "\n! `" + Object.keys(dict) + "`");

}

async function meowCommand(receivedMessage) {
    try {
        var myCatArray = ['😻', '😽', '🙀', '😼', '😹', '😸', '😺'];
        var randCat = myCatArray[Math.floor(Math.random() * myCatArray.length)];
        receivedMessage.react(randCat)

        // pass the name of the user who sent the message for stats later, expect an array of images to be returned.
        var images = await loadImage(receivedMessage.author.username);

        // get the Image, and first Breed from the returned object.
        var image = images[0];
        var breed = image.breeds[0];

        console.log('message processed', 'showing', breed)
        // use the *** to make text bold, and * to make italic
        receivedMessage.channel.send("Meow 🐈",
            //"***"+breed.name + "*** \r *"+breed.temperament+"*", 
            { files: [image.url] });
        // if you didn't want to see the text, just send the file
        var randomNumLuvs = getRandomInt(1, 3);
        var randomNumLevelProgress = getRandomInt(3, 11);
        updatePersonalCatStats(receivedMessage, "luvs", randomNumLuvs);
        updatePersonalCatStats(receivedMessage, "levelProgress", randomNumLevelProgress);

    } catch (error) {
        console.log(error)
    }
}

async function loadImage(sub_id) {
    // you need an API key to get access to all the iamges, or see the requests you've made in the stats for your account
    var headers = {
        'X-API-KEY': cat_token,
    }
    var query_params = {
        'has_breeds': true, // we only want images with at least one breed data object - name, temperament etc
        'mime_types': 'gif,png', // we only want static images as Discord doesn't like gifs
        'size': 'large',   // get the small images as the size is prefect for Discord's 390x256 limit
        'sub_id': sub_id, // pass the message senders username so you can see how many images each user has asked for in the stats
        'limit': 1       // only need one
    }
    // convert this obejc to query string 
    let queryString = JSON.stringify(query_params);

    try {
        // construct the API Get request url
        let _url = CAT_API_URL + `v1/images/search?${queryString}`;
        console.log('URL = ' + _url);
        // make the request passing the url, and headers object which contains the API_KEY
        var response = await r2.get(_url, { headers }).json
    } catch (e) {
        console.log(e)
    }
    return response;
}

function meowReact(receivedMessage) {
    receivedMessage.channel.send(receivedMessage.author.toString() + " Meow??? 🙀")
}

function pintsCommand(receivedMessage) {
    receivedMessage.channel.send(receivedMessage.author.toString() + " Meow!! :smiley_cat:", { files: ["http://crow202.org/2009/cat_guinness.jpg"] });
}

function gitCommand(receivedMessage) {
    receivedMessage.channel.send(receivedMessage.author.toString() + " 🙀 My git repository = https://github.com/LexanderO/Cat_Discord_Bot.git 🙀")
}

function statusCommand(receivedMessage) {
    var userRegistered = false;
    var user = receivedMessage.author.toString();
    userRegistered = checkIfNewUser(receivedMessage);

    for (var i = 0; i < catStatus.luvToUsers.length; i++) {
        if (userRegistered && catStatus.luvToUsers[i].userName === user) {
            //receivedMessage.channel.send(receivedMessage.author.toString() + "\n Hunger = " + catStatus.hunger + "\n Fun = " + catStatus.fun + "\n Cat Luv = " + catStatus.luvToUsers[i].userName + " " + catStatus.luvToUsers[i].luvs);
            console.log("Printed out -" + JSON.stringify(catStatus));
            var hungerResult = processStatus("hunger");
            var funResult = processStatus("fun");

            receivedMessage.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: receivedMessage.author.username,
                        icon_url: receivedMessage.author.avatarURL
                    },
                    title: "Cat Status",
                    url: "",
                    description: "",
                    fields: [{
                        name: "Hunger",
                        value: hungerResult
                    },
                    {
                        name: "Fun",
                        value: funResult
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: buildVersion
                    }
                }
            });
        }
        else {

        }
    }
}

function processStatus(category) {
    switch (category) {
        case "hunger":
            var positiveStat = Math.round(catStatus.hunger / 10);
            var iconPos = "🍕"
            break;
        case "fun":
            var positiveStat = Math.round(catStatus.fun / 10);
            var iconPos = "😸"
            break;
    }
    var negativeStat = 10 - positiveStat;
    var result = "{"
    var iconNeg = "✖";

    for (var i = 0; i < positiveStat; i++) {
        result += iconPos;
    }
    for (var i = 0; i < negativeStat; i++) {
        result += iconNeg;
    }
    result += "}";
    return result;
}

function checkIfNewUser(receivedMessage) {
    var user = receivedMessage.author.toString();
    for (var i = 0; i < catStatus.luvToUsers.length; i++) {
        if (catStatus.luvToUsers[i].userName === user) {
            console.log("Exists -" + JSON.stringify(catStatus));
            return true;
        }
    }
    addNewUser(user);
    return true;
}

function addNewUser(user) {
    var data = {
        "userName": user,
        "luvs": 0,
        "catLevel": 0,
        "levelProgress": 0
    };
    catStatus.luvToUsers.push(data);
    console.log("Added -" + JSON.stringify(catStatus));
}

function saveCommand(receivedMessage) {
    receivedMessage.channel.send("Current CAT Stats saved! 😼");
    saveProgress();
}

function saveProgress() {
    let data = JSON.stringify(catStatus, null, 2);

    fs.writeFile('status_save.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

function feedCommand(receivedMessage) {
    var catHunger = catStatus.hunger;
    if (catHunger >= 90 && catHunger <= 100) {
        receivedMessage.channel.send(receivedMessage.author.toString() + " 🙀 Too much food, not hungry 😼, purr-haps later")
    }
    else if (catHunger <= 89) {
        var randomNumFeed = getRandomInt(10, 25);
        var randomNumLuvs = getRandomInt(1, 4);
        var randomNumLevelProgress = getRandomInt(5, 15);
        catStatus.hunger = catHunger + randomNumFeed;
        if (catStatus.hunger >= 100) {
            catStatus.hunger = 100;
        }
        console.log("Random Results & Feed " + randomNumFeed + " " + randomNumLuvs + " " + randomNumLevelProgress);
        receivedMessage.channel.send(receivedMessage.author.toString() + " Paw-some food! I eat.. 😺")

        updatePersonalCatStats(receivedMessage, "luvs", randomNumLuvs);
        updatePersonalCatStats(receivedMessage, "levelProgress", randomNumLevelProgress);
    }
}

function updatePersonalCatStats(receivedMessage, stat, value) {
    var user = receivedMessage.author.toString();
    for (var i = 0; i < catStatus.luvToUsers.length; i++) {
        if (catStatus.luvToUsers[i].userName === user) {
            switch (stat) {
                case "luvs":
                    catValue = catStatus.luvToUsers[i].luvs;
                    catStatus.luvToUsers[i].luvs = catValue + value;
                    if (catStatus.luvToUsers[i].luvs >= 100) {
                        catStatus.luvToUsers[i].luvs = 100;
                    }
                    break;
                case "levelProgress":
                    catValue = catStatus.luvToUsers[i].levelProgress;
                    catStatus.luvToUsers[i].levelProgress = catValue + value;
                    levelUp(receivedMessage);
                    break;
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getHungry() {
    var randomNumFeed = getRandomInt(1, 3);
    var catHunger = catStatus.hunger;
    catStatus.hunger = catHunger - randomNumFeed;
    if (catStatus.hunger <= 0) {
        catStatus.hunger = 0;
    }
}

function levelUp(receivedMessage) {
    var user = receivedMessage.author.toString();
    for (var i = 0; i < catStatus.luvToUsers.length; i++) {
        if (catStatus.luvToUsers[i].userName === user) {
            if (catStatus.luvToUsers[i].levelProgress >= 100) {
                catStatus.luvToUsers[i].levelProgress = 100;
                var level = catStatus.luvToUsers[i].catLevel;
                catStatus.luvToUsers[i].catLevel + 1;
                var resultLevel = catStatus.luvToUsers[i].catLevel;
                receivedMessage.channel.send(receivedMessage.author.toString() + " Contrats!😺 You are now 🙀 `Lvl " + resultLevel + " Meowster` 🙀");
                var randomNumLuvs = getRandomInt(3, 8);
                updatePersonalCatStats(receivedMessage, "luvs", randomNumLuvs);
            }
            else {

            }
        }
    }
}

function levelCommand(receivedMessage) {
    var user = receivedMessage.author.toString();
    for (var i = 0; i < catStatus.luvToUsers.length; i++) {
        if (catStatus.luvToUsers[i].userName === user) {
            var resultLevel = catStatus.luvToUsers[i].catLevel;
            receivedMessage.channel.send(receivedMessage.author.toString() + " 😺 `Lvl " + resultLevel + " Meowster` 😺");
        }
    }
}

function minusLuvs() {
    for (var i = 0; i < catStatus.luvToUsers.length; i++) {
        var luvs = catStatus.luvToUsers[i].luvs;
        catStatus.luvToUsers[i].luvs = luvs - 1;
        if (catStatus.luvToUsers[i].luvs <= 0) {
            catStatus.luvToUsers[i].luvs = 0;
        }
    }
}