require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const schedule = require("node-schedule");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const botToken = process.env.BOT_TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, () => {
  console.log("Ready!");
  const job = schedule.scheduleJob("alert", "0 8 * * *", () => {
    const channel = client.channels.cache.get("1175256511468011630");
    channel.send("<@&1175178345466581192> sup");
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(botToken);
