// const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
// // const battlemetrics = require("./structures/Battlemetrics.js");

// // Replace with your bot token from @BotFather
// const token = process.env.BOT_TOKEN;
// // Create a bot instance
// const bot = new TelegramBot(token, { polling: true });

// // Store connection data for each user
// const userConnections = new Map();
// const userStates = new Map();

// // Log when bot is ready
// console.log("Bot is running...");

// // Handle /start command
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   const opts = {
//     reply_markup: {
//       inline_keyboard: [
//         [{ text: "Connect Rust+", callback_data: "connect" }],
//         [{ text: "Add Player", callback_data: "add_player" }],
//         [{ text: "Add Device", callback_data: "add_device" }],
//       ],
//     },
//   };

//   bot.sendMessage(
//     chatId,
//     "Welcome! Click the button below to enter ID you want to track:",
//     opts
//   );
// });

// // Handle button click
// bot.on("callback_query", async (callbackQuery) => {
//   try {
//     const msg = callbackQuery.message;

//     if (!msg) {
//       console.error("❌ callbackQuery.message is undefined:", callbackQuery);
//       return;
//     }

//     const chatId = msg.chat.id;
//     const data = callbackQuery.data;

//     try {
//       switch (data) {
//         case "add_player":
//           userStates.set(chatId, "waiting_for_id");
//           await bot.sendMessage(chatId, "Please send me steam ID of user:");
//           break;

//         case "add_device":
//           userStates.set(chatId, "waiting_for_device");
//           await bot.sendMessage(chatId, "Please enter the device ID to add:");
//           break;

//         case "connect":
//           userStates.set(chatId, "waiting_for_connect");
//           await bot.sendMessage(chatId, "<ip> <port> <playerId> <playerToken>");
//           break;

//         default:
//           await bot.sendMessage(chatId, "Unknown action. Please use /start.");
//           break;
//       }

//       await bot.answerCallbackQuery(callbackQuery.id);
//     } catch (err) {
//       console.error("Error handling callback query:", err);
//     }
//   } catch (err) {
//     console.error("Outer error in callback_query handler:", err);
//   }
// });

const id = "76561198273818482";
async function GET_PROFILE_DATA_API_CALL(id) {
  return `https://api.battlemetrics.com/players/${id}?include=identifier`;
}

let info = GET_PROFILE_DATA_API_CALL(id);

console.log(info);
// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const id = msg.text;

//   // Ignore commands like /start
//   if (id.startsWith("/")) return;

//   const state = userStates.get(chatId);

//   if (state === "waiting_for_id") {
//     userStates.delete(chatId);

//     await bot.sendMessage(chatId, ` Player "${id}" added to your watchlist!`);

//     try {
//       GET_PROFILE_DATA_API_CALL(id);
//     } catch (err) {
//       console.error("Battlemetrics error: ", err);
//     }

//     // await bot.sendMessage(chatId, `✅ Your ID "${text}" was saved!`);
//     //     // TODO: Save this ID to DB or file
//   } else if (state === "waiting_for_device") {
//     userStates.delete(chatId);
//     await bot.sendMessage(chatId, `💻 Device "${id}" added to your watchlist!`);
//     // TODO: Save device name or ID to DB or file
//   } else {
//     await bot.sendMessage(chatId, "Please use /start to choose an action.");
//   }
// });
