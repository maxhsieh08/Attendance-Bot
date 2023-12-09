const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clockin")
    .setDescription("clock in for the day"),
  async execute(interaction) {
    const rawData = fs.readFileSync("userData.json");
    const users = JSON.parse(rawData);
    const index = users.users.findIndex((u) => u.id === interaction.user.id);
    const today6AM = new Date();

    // Set time to 6 AM in UTC
    today6AM.setUTCHours(6, 0, 0, 0);

    // Calculate the time zone offset for Los Angeles in milliseconds
    // PST is UTC-8 and PDT is UTC-7
    let losAngelesOffset = today6AM.getTimezoneOffset() + 480;

    // Adjust the date object to Los Angeles time
    today6AM.setMinutes(today6AM.getMinutes() - losAngelesOffset);
    // Create a new Date object for the current time
    const now = new Date();

    // Convert the current time to Los Angeles time
    const currentTime = now.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    const isWithinTimeRange =
      currentTime.getHours() >= 6 && currentTime.getHours() < 9;

    let canClockIn = false;

    let lastClockInTime;
    if (index !== -1) {
      lastClockInTime = new Date(users.users[index].lastClockIn);

      // Check if last clock-in was before today's 6 AM and current time is within 6 AM to 9 AM
      if (lastClockInTime < today6AM && isWithinTimeRange) {
        canClockIn = true;
        users.users[index].checkInCount += 1;
        users.users[index].checkInStreak += 1;
        users.users[index].lastClockIn = currentTime.toISOString();
        users.users[index].missedDaysStreak = 0;
      }
    } else if (isWithinTimeRange) {
      // New user clocking in for the first time and current time is within 6 AM to 9 AM
      users.users.push({
        id: interaction.user.id,
        checkInCount: 1,
        checkInStreak: 1,
        lastClockIn: currentTime.toISOString(),
        missedDaysStreak: 0,
      });
      canClockIn = true;
    }

    fs.writeFileSync("userData.json", JSON.stringify(users, null, 2));

    if (canClockIn) {
      await interaction.reply(
        `<@${interaction.user.id}> has successfully clocked in for today`
      );
    } else if (!canClockIn && lastClockInTime >= today6AM) {
      await interaction.reply(
        `<@${interaction.user.id}> you already clocked in today`
      );
    } else {
      await interaction.reply(
        `<@${interaction.user.id}> you missed the clock in window already`
      );
    }
  },
};
