const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-role-ping")
    .setDescription("change role that bot will ping daily")
    .addStringOption((option) =>
      option
        .setName("new-role")
        .setDescription("new role that bot will ping")
        .setRequired(true)
    ),
  async execute(interaction) {
    const option = interaction.options.getString("new-role");
    // const newRole = interaction.guild.roles.cache.find(
    //   (role) => role.name === "new-role"
    // );
    await interaction.reply(option);
  },
};
