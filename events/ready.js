const { Events } = require("discord.js");
const schedule = require("node-schedule");
const fs = require("fs");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    const channel = client.channels.cache.get("1175256511468011630");
    schedule.scheduleJob("alert", "0 6 * * *", () => {
      channel.send("<@&1175178345466581192> project time");
      const rawData = fs.readFileSync("userData.json");
      const users = JSON.parse(rawData);
      const currentDay = new Date();
      for (const streak of users.users) {
        const date = new Date(streak.lastClockIn).getDate();
        if (date !== currentDay.getDate() - 1) {
          streak.checkInStreak = 0;
          streak.missedDaysStreak += 1;
        }
      }
      fs.writeFileSync("userData.json", JSON.stringify(users, null, 2));
    });
    schedule.scheduleJob("alert", "0 8 * * *", () => {
      channel.send("<@&1175178345466581192> one more hour to check in");
    });
  },
};
