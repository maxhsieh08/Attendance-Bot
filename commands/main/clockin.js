const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  // cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("clockin")
    .setDescription("clock in for the day"),
  async execute(interaction) {
    const rawData = fs.readFileSync("userData.json");
    const users = JSON.parse(rawData);
    const index = users.users.findIndex((u) => u.id === interaction.user.id);
    if (index !== -1) {
      users.users[index].checkInCount += 1;
    } else {
      users.users.push({
        id: interaction.user.id,
        checkInCount: 1,
      });
    }
    fs.writeFileSync("userData.json", JSON.stringify(users, null, 2));

    await interaction.reply(
      `<@${interaction.user.id}> has successfully clocked in for today`
    );
  },
};
