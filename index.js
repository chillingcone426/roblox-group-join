const group = require('./group.js')

// Import the discord.js module
const { Client, GatewayIntentBits, Partials, MessageActionRow, MessageButton, ButtonStyle } = require('discord.js');

// Create a new Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel, Partials.Message] });

client.on('messageCreate', message => {
    if(message.author.bot) return
    // If the message is "!sendmessage"
    if (message.content.startsWith('!join')) {
        const parts = message.content.trim().split(/\s+/);
    
        const command = parts.shift().toLowerCase(); 
        const args = parts;

        if(!args[0]) return message.reply("Must include a roblox group id!")
        

        group.run(client, message, args);
    }
});

// When the client is ready, run this code
// This event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');
});

// Login to Discord with your app's token
client.login('TOKEN-HERE');


// Use the function
