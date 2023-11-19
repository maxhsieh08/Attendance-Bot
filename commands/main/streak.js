const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("streak")
    .setDescription("shows number of days clocked in streak"),
  async execute(interaction) {
    const rawData = fs.readFileSync("userData.json");
    const users = JSON.parse(rawData);
    const index = users.users.findIndex(
      (u) => u.streak === interaction.user.streak
    );
  },
};
