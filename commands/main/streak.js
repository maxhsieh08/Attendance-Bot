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
    if (index !== -1 && users.users[index].checkInStreak === 1) {
      await interaction.reply(
        `you have a clock in streak of ${users.users[index].checkInStreak} day`
      );
    } else if (index !== -1) {
      await interaction.reply(
        `you have a clock in streak of ${users.users[index].checkInStreak} days`
      );
    } else {
      await interaction.reply(`no data found.`);
    }
  },
};
