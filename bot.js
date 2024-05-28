import { Client, IntentsBitField } from "discord.js";
import { handleCommands } from "./commandHandler.js";

const client = new Client({intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMessagePolls, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.Guilds]});

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
});

client.login('TOKEN_HERE');

handleCommands()

export {client}
