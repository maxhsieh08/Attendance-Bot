const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("displays users by days checked in"),
  async execute(interaction) {
    const rawData = fs.readFileSync("userData.json");
    const users = JSON.parse(rawData);
    const sortedUsers = users.users
      .slice()
      .sort((a, b) => b.checkInCount - a.checkInCount);
    const leaderboardStr = sortedUsers.map((user, index) => {
      return `${index + 1}: <@${user.id}> - ${user.checkInCount} clock-${
        user.checkInCount === 1 ? "in" : "ins"
      }`;
    });
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Leaderboard")
      .addFields({ name: "Total Clock-ins", value: leaderboardStr.join("\n") })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
