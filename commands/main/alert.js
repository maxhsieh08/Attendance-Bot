const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alert")
    .setDescription("pings projects role"),
  async execute(interaction) {
    await interaction.reply("<@&1175178345466581192>");
  },
};
