const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const random = require('random');
const _ = require('lodash');

let servers = {};
let loop = false;
let skiprequest = false;
let youtube_API_Key = "REPLACE WITH YOUR API KEY AND LOAD IT FROM A JSON FILE";

function helpCommand (arguments, receivedMessage) {
    if (arguments.length === 0) {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `?help [topic]`");
    } else{
        receivedMessage.channel.send("It looks like you need help with " + arguments.join(" "));
    }
}

function multiplyCommand (arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough arguments. Try `?multiply 2 10`");
        return;
    }
    let product = 1;
    arguments.forEach((value) => {
       product *= parseFloat(value);
    });
    receivedMessage.channel.send("The product of " + arguments + " is " + product.toString());
}

function pong (arguments, receivedMessage) {
    receivedMessage.channel.send("Pong!");
}

function alkoholblues (arguments, receivedMessage) {
    if (arguments.length === 0) {
        receivedMessage.channel.send("Wo sind denn die Spieler?!");
        return;
    }
    let words = ["Alkohol", "Alkohol + Bier", "Trinken", "Körperteile"];
    let wordslength = words.length;

    let assigned = "";

    for (let i = 0; i < arguments.length - wordslength; i++) {
        words.push(words[random.int(0, wordslength - 1)]);
    }
    words = _.shuffle(words);
    for (let i = 0; i < arguments.length; i++) {
        if (random.int(1, 1000) === 1) {
            assigned += arguments[i] + ": Lalalala la la lala lala lalalala la la lala lala lalalala la la lala lala lalalala la la das ist der Alkohol Blues!!!\n";
        } else {
            assigned += arguments[i] + ": " + words[i] + "\n";
        }
    }
    _.trim(assigned, '\n');
    receivedMessage.channel.send("Was ist denn hier los?!\n" + assigned);
}

//song stuff start

async function playMusic (arguments, receivedMessage) {
    function play(connection, message) {
        let server = servers[message.guild.id];

        server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

        server.dispatcher.on("finish", function () {
            if (!loop) {
                server.queue.shift();
            }
            if (skiprequest) {
                skiprequest = false;
                loop = true;
            }
            if (server.queue[0]) {
               play(connection, message);
           } else {
               connection.disconnect();
           }
        });
    }

    if (arguments.length === 0) {
        receivedMessage.channel.send("The link is missing!");
        return;
    }
    if (!receivedMessage.member.voice.channel) {
        receivedMessage.channel.send("You must be in a channel to play!");
        return;
    }
    if (!servers[receivedMessage.guild.id]) {
        servers[receivedMessage.guild.id] = {
            queue: []
        }
    }
    let server = servers[receivedMessage.guild.id];

    try {
        const songInfo = await ytdl.getInfo(arguments[0]);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        };
        receivedMessage.channel.send(`${song.title} has been added to the queue!`);
    } catch (e) {
        receivedMessage.channel.send("Can't play song!");
        return;
    }
    server.queue.push(arguments[0]);

    if (receivedMessage.guild.voice === undefined || !receivedMessage.guild.voice.connection) {
        receivedMessage.member.voice.channel.join().then(function(connection){
            play(connection, receivedMessage)
        });
    }
}

async function skipMusic(arguments, receivedMessage) {
    let server = servers[receivedMessage.guild.id];
    if (server.dispatcher) {
        if (loop){
            loop = false;
            server.dispatcher.end();
            skiprequest = true;
        } else {
            server.dispatcher.end();
        }
    }
    receivedMessage.channel.send("Skipping the song!");
}

function stopMusic(arguments, receivedMessage) {
    let server = servers[receivedMessage.guild.id];
    if (receivedMessage.guild.voice !== undefined) {
        if (receivedMessage.guild.voice.connection) {
            for (let i = server.queue.length - 1; i >= 0 ; i--) {
                server.queue.splice(i, 1);
            }

            server.dispatcher.end();
            receivedMessage.channel.send("Ending the queue leaving the voice channel!");
            console.log('stopped the queue');
        }
        if (receivedMessage.guild.connection) {
            receivedMessage.guild.voice.connection.disconnect();
        }
    } else {
        receivedMessage.channel.send("Can't stop because there is no song playing!");
        return;
    }
}

function pauseMusic(arguments, receivedMessage){
    let server = servers[receivedMessage.guild.id];
    if (server === undefined){
        receivedMessage.channel.send("There's no song playing!");
        return;
    }
    if (server.dispatcher) {
        server.dispatcher.pause();
        receivedMessage.channel.send("Paused the song!");
        console.log("paused the song");
    }
}

function resumeMusic(arguments, receivedMessage){
    let server = servers[receivedMessage.guild.id];
    if (server === undefined){
        receivedMessage.channel.send("There's no song playing!");
        return;
    }
    if (server.dispatcher) {
        server.dispatcher.resume();
        receivedMessage.channel.send("Resuming!");
        console.log("resumed");
    }
}

function loopSong (arguments, receivedMessage) {
    loop = !loop;
    if (loop) {
        receivedMessage.channel.send("Loop activated!");
    } else {
        receivedMessage.channel.send("Loop deactivated!");
    }
}

async function whowinsgodzillaormonkey (arguments, receivedMessage) {
    receivedMessage.channel.send(". . . thinking . . .");
    const attachment = new Discord.MessageAttachment("https://media1.tenor.com/images/7dceda6bc12a5ee25d950c58b14dbd5b/tenor.gif?itemid=9040001");
    await receivedMessage.channel.send(attachment);
    receivedMessage.channel.send("Monekeee🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍🦍");

}

// song stuff ending


module.exports = {
    helpCommand,
    multiplyCommand,
    pong,
    alkoholblues,
    playMusic,
    skipMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    loopSong,
    whowinsgodzillaormonkey
}