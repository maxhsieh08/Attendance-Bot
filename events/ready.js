const { Events } = require("discord.js");
const schedule = require("node-schedule");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    schedule.scheduleJob("alert", "0 8 * * *", () => {
      const channel = client.channels.cache.get("1175256511468011630");
      channel.send("<@&1175178345466581192> sup");
    });
  },
};
