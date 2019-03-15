# A Feline (Cat) Discord Bot 😹
The Bot - for all of your cat lovin needs, for your discord channel. Easy to setup (guide below).

Not only that you get nice cat pictures, but also you can play with the cat, feed, pet it. The cat can get too full, or tired, stats do decrease over period of time. The more you interact with the cat bot the more it will love you, also users of the cat get to level up. Cat stats and user records are auto-saved (no DB required), no need to worry in case server gets shut down.

### 😺 Commands - Currently available:
* **!meow** - Posts a random purr-fect picture of feline friends.
* **!help** @(discord cat name) - Lists available cat commands and currently running version within discord.
* **!feed** @(discord cat name) - Feed the cat with random food.
* **!pet** @(discord cat name) - Pet the cat with random action.
* **!status** @(discord cat name) - Shows status of kitty stats (**hunger** 🍕, **fun** 😸, how much the cat **loves** you 😻 and how much more exp you need to **level** up 👌.
* **!level** @(discord cat name) - Displays your current meowster level.
* **!save** @(discord cat name) - Manual save current stats for all users, dont worry there is auto-save enabled, this command is not required. The kitten has a good memory.

### 😺 Policy
Feel free to play with code, use for your discord server, share it with friends, *plz credit me :P*, basicly have fun. You may share this repo URL on other websites.
But **DO NOT** put out a bot running this code or altered version of this code to https://discordbots.org/ or any websites that list discord bots without giving this repo and me credit.
*Thank you! <3*

### 😺 Setup Guide - Easy stuff
Requirements:
* 2 API keys (discord & thecatapi)
* Node.js (some hosting environment that has Node.js available)
*The bot can be deployed and executed on local or on servers. I personally prefer AWS Lightsail (cheap and very reliable for discord bots)

Steps:
1. Quick sign up with https://thecatapi.com/ and you will recieve a cat API key.
2. Follow this <a href="https://www.devdungeon.com/content/javascript-discord-bot-tutorial">Tutorial</a> to configure Discord Dev account and recieve your discord API key. Also from discord dev configuration panel you should be able to invite the bot into your discord server.
3. Edit config.json file and insert the API keys
```
{
    "d_token": "INSERT Discord API Key",
    "cat_token": "INSERT Cat API Key"
}
```
4. Click on <a href="https://github.com/LexanderO/Cat_Discord_Bot/releases">Releases</a> select a release (latest one), click on **Assets** dropdown and download **Source Code** archive. All of this can be also done through *git clone* command.
5. Deployment- Node.js required if it is will be running on your local machine or on your server. Open command line and **cd** into the project folder, where *package.json* file is.
6. Execute the following command 
```
npm install
```
This will make node.js pull down all required packages into the project (node_modules folder) wait untill it finishes, very fast process.
7. Execute the following command 
```
npm start
```
The Bot should start and a message shall appear saying *Connected as (bot name)*
Check your discord server, if the bot has been already invited then it should appear as online.

*If you are deploying newer version of the bot on top of older one, then make sure you don't overwrite the following files:*
* config.json (API keys)
* status_save.json (contains cat stats and user records)

Enjoy! 😻



### Good Tutorial for starting dev on Discord JS Bot
<a href="https://www.devdungeon.com/content/javascript-discord-bot-tutorial">Dev_Dungeon</a>

