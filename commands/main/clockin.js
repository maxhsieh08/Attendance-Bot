const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clockin")
    .setDescription("clock in for the day"),
  async execute(interaction) {
    await interaction.reply(
      `<@${interaction.user.id}> has successfully clocked in for today`
    );
  },
};
