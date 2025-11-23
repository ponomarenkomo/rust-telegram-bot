const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const battlemetrics = require("./structures/Battlemetrics.js");
const TeamManager = require("./commands/teamManager.js");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const manager = new TeamManager();

// userStates: { chatId → { step, steamId? } }
const userStates = new Map();

console.log("Bot is running...");

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Connect Rust+", callback_data: "connect" }],
        [{ text: "Add Player", callback_data: "add_player" }],
        [{ text: "Add Device", callback_data: "add_device" }],
        [{ text: "List Teams", callback_data: "list_teams" }],
        [{ text: "List Team Members", callback_data: "list_team_members" }],
      ],
    },
  };

  bot.sendMessage(chatId, "Welcome! What do you want to do?", opts);
});

// Handle button click
bot.on("callback_query", async (callbackQuery) => {
  const msg = callbackQuery.message;
  if (!msg) return;

  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith("show_team_")) {
    const teamName = data.replace("show_team_", "");
    const team = manager.getTeam(teamName);

    if (!team) {
      await bot.sendMessage(chatId, `❌ Team "${teamName}" not found.`);
      return;
    }

    if (!team.players || team.players.length === 0) {
      await bot.sendMessage(chatId, `Team "${teamName}" has no players yet.`);
      return;
    }

    const text = team.players.map((id) => `• ${id}`).join("\n");

    await bot.sendMessage(chatId, `Members of *${teamName}*:\n${text}`, {
      parse_mode: "Markdown",
    });

    return;
  }

  switch (data) {
    case "add_player":
      userStates.set(chatId, { step: "waiting_for_steam_id" });
      await bot.sendMessage(chatId, "Send me the player's Steam ID:");
      break;

    case "add_device":
      userStates.set(chatId, { step: "waiting_for_device" });
      await bot.sendMessage(chatId, "Enter the device ID:");
      break;

    case "connect":
      userStates.set(chatId, { step: "waiting_for_connect" });
      await bot.sendMessage(chatId, "<ip> <port> <playerId> <playerToken>");
      break;
    case "list_teams": {
      const teams = manager.getAllTeams();

      if (teams.length === 0) {
        await bot.sendMessage(chatId, "No teams created yet.");
        break;
      }

      const text = teams.map((t) => `• ${t.name}`).join("\n");
      await bot.sendMessage(chatId, "Teams:\n" + text);
      break;
    }

    case "list_team_members": {
      const teams = manager.getAllTeams();

      if (teams.length === 0) {
        await bot.sendMessage(chatId, "No teams available.");
        break;
      }

      // Build inline keyboard of teams to pick from
      const keyboard = teams.map((t) => [
        {
          text: t.name,
          callback_data: `show_team_${t.name}`,
        },
      ]);

      await bot.sendMessage(chatId, "Choose a team:", {
        reply_markup: { inline_keyboard: keyboard },
      });
      break;
    }

    default:
      await bot.sendMessage(chatId, "Unknown action. Use /start.");
      break;
  }

  await bot.answerCallbackQuery(callbackQuery.id);
});

// Handle user input after button click
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore commands like /start
  if (text.startsWith("/")) return;

  const state = userStates.get(chatId);
  if (!state) {
    return bot.sendMessage(chatId, "Use /start to choose an action.");
  }

  // STEP 1 → waiting for steam ID
  if (state.step === "waiting_for_steam_id") {
    state.steamId = text.trim();
    state.step = "waiting_for_team_name";

    return bot.sendMessage(chatId, "Now enter the team name:");
  }

  // STEP 2 → waiting for team name
  if (state.step === "waiting_for_team_name") {
    const teamName = text.trim().toLowerCase();

    // Check if team exists
    let team = manager.getTeam(teamName);
    if (!team) {
      team = manager.createTeam(teamName);
      await bot.sendMessage(chatId, `📝 Team *${teamName}* created.`, {
        parse_mode: "Markdown",
      });
    }

    // Add the user to the team
    manager.addUserToTeam(teamName, state.steamId);

    await bot.sendMessage(
      chatId,
      `👤 Player *${state.steamId}* added to team *${teamName}*!`,
      { parse_mode: "Markdown" }
    );

    // Optional: Steam profile fetch
    try {
      const steamName = await battlemetrics.getSteamProfileInfo(state.steamId);
      console.log("Fetched Steam profile:", steamName);
    } catch (err) {
      console.error("Error fetching Steam name:", err);
    }

    // Clear state
    userStates.delete(chatId);
    return;
  }

  // Add device
  if (state.step === "waiting_for_device") {
    await bot.sendMessage(chatId, `💻 Device "${text}" added!`);
    userStates.delete(chatId);
    return;
  }

  // Connect Rust+
  if (state.step === "waiting_for_connect") {
    await bot.sendMessage(chatId, `🔗 Connect string received: ${text}`);
    userStates.delete(chatId);
    return;
  }
});
