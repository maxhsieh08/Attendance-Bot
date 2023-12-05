const { Events } = require("discord.js");
const schedule = require("node-schedule");
const fs = require("fs");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    const channel = client.channels.cache.get("1175256511468011630");
    const rule = new schedule.RecurrenceRule();
    rule.tz = "America/Los_Angeles";
    rule.second = 0;
    rule.minute = 0;
    rule.hour = 6;
    schedule.scheduleJob(rule, () => {
      channel.send("<@&1175178345466581192> project time");
      const rawData = fs.readFileSync("userData.json");
      const users = JSON.parse(rawData);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      for (const streak of users.users) {
        const date = new Date(streak.lastClockIn).getDate();
        if (date !== yesterday.getDate()) {
          streak.checkInStreak = 0;
          streak.missedDaysStreak += 1;
        }
      }
      fs.writeFileSync("userData.json", JSON.stringify(users, null, 2));
    });
    const pingEnd = new schedule.RecurrenceRule();
    pingEnd.tz = "America/Los_Angeles";
    pingEnd.second = 0;
    pingEnd.minute = 0;
    pingEnd.hour = 9;
    schedule.scheduleJob(pingEnd, () => {
      channel.send("<@&1175178345466581192> check-ins closed for today");
    });
  },
};
