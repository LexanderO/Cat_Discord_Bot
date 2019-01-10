const Discord = require ('discord.js');
const queryString = require('querystring');
const r2 = require('r2');

const client = new Discord.Client();

const {d_token} = require ('./config.json');
const {cat_token} = require ('./config.json');
const CAT_API_URL = "https://api.thecatapi.com/"

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
});

client.on('error', data => {
    console.log('error',data);
    // attempt reconnection x times, after x seconds, exponential backoff
  });

client.login(d_token);

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

function searhCommand(receivedMessage, primaryCommand, arguments){
    switch(primaryCommand){
        case "help":
            helpCommand(arguments, receivedMessage);
            break;
        case "meow":
            meowRecieved(receivedMessage);
            break;
        default:
            receivedMessage.channel.send("I don't understand the command. Try `!help`")
    }

}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)
    } else {
        receivedMessage.channel.send("Here is the full list of comman_{@:ds:L@L:port:90'#ds:>{~@:_____ Error: 404 Commands not Found")
    }
}

async function meowRecieved(receivedMessage)
{
  try{
    // pass the name of the user who sent the message for stats later, expect an array of images to be returned.
    var images = await loadImage(receivedMessage.author.username);

    // get the Image, and first Breed from the returned object.
    var image = images[0];
    var breed = image.breeds[0];

    console.log('message processed','showing',breed)
    // use the *** to make text bold, and * to make italic
    receivedMessage.channel.send( //"***"+breed.name + "*** \r *"+breed.temperament+"*", 
    { files: [ image.url ] } );
    // if you didn't want to see the text, just send the file

  }catch(error)
  {
    console.log(error)
  }
}

async function loadImage(sub_id)
{
  // you need an API key to get access to all the iamges, or see the requests you've made in the stats for your account
  var headers = {
      'X-API-KEY': cat_token,
  }
  var query_params = {
    'has_breeds':true, // we only want images with at least one breed data object - name, temperament etc
    'mime_types':'gif,jpg,png', // we only want static images as Discord doesn't like gifs
    'size':'large',   // get the small images as the size is prefect for Discord's 390x256 limit
    'sub_id': sub_id, // pass the message senders username so you can see how many images each user has asked for in the stats
    'limit' : 1       // only need one
  }
  // convert this obejc to query string 
  let queryString = JSON.stringify(query_params);

  try {
    // construct the API Get request url
    let _url = CAT_API_URL + `v1/images/search?${queryString}`;
    console.log('URL = '+ _url);
    // make the request passing the url, and headers object which contains the API_KEY
    var response = await r2.get(_url , {headers} ).json
  } catch (e) {
      console.log(e)
  }
  return response;

}