const Discord = require('discord.js');
const client = new Discord.Client();
const Commands = require('./Commands');

const PREFIX = "?";

window.open('https://www.youtube.com/')

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);

    client.user.setActivity("One Piece Episode 10", {type: "WATCHING"});

    client.guilds.cache.forEach((guild) => {
        console.log(guild.name);
        guild.channels.cache.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
        });
    });

    console.log(`The Bot is currently on ${client.guilds.cache.size} servers`)
});

client.on('message', (receivedMessage) => {
   if (receivedMessage.author === client.user){
       return;
   }

    if (receivedMessage.content.startsWith(PREFIX)){
        processCommand(receivedMessage);
    }
});

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0].toLowerCase();
    let arguments = splitCommand.slice(1);

    if (primaryCommand === "help") {
        Commands.helpCommand(arguments, receivedMessage);
    } else if (primaryCommand === "multiply") {
        Commands.multiplyCommand(arguments, receivedMessage);
    } else if (primaryCommand === "ping") {
        Commands.pong(arguments, receivedMessage);
    } else if (primaryCommand === "alkoholblues") {
        Commands.alkoholblues(arguments, receivedMessage);
    } else if (primaryCommand === "play") {
        Commands.playMusic(arguments, receivedMessage);
    } else if (primaryCommand === "skip") {
        Commands.skipMusic(arguments, receivedMessage);
    } else if (primaryCommand === "stop") {
        Commands.stopMusic(arguments, receivedMessage);
    } else if (primaryCommand === "pause") {
        Commands.pauseMusic(arguments, receivedMessage);
    } else if (primaryCommand === "resume") {
        Commands.resumeMusic(arguments, receivedMessage);
    } else if (primaryCommand === "loop") {
        Commands.loopSong(arguments, receivedMessage);
    } else if (primaryCommand === "whowinsgodzillaormonkey?") {
        Commands.whowinsgodzillaormonkey(arguments, receivedMessage);
    } else {
        receivedMessage.channel.send("Unknown command. Try `?help` or `?multiply`");
    }
}

client.login("REPLACE WITH YOUR TOKEN AND LOAD IT FROM A JSON FILE");