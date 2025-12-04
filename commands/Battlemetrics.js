const Axios = require("axios");
const Fs = require("fs");
const Path = require("path");

const STEAM_PROFILES_URL = "https://steamcommunity.com/profiles/";

function decodeHtml(str) {
  const htmlReservedSymbols = JSON.parse(
    Fs.readFileSync(
      Path.join(__dirname, "..", "staticFiles", "htmlReservedSymbols.json"),
      "utf8"
    )
  );

  for (const [key, value] of Object.entries(htmlReservedSymbols)) {
    str = str.replace(key, value);
  }

  return str;
}

async function resolveSteamId(input) {
  // If it's a full URL → extract last part
  if (input.includes("steamcommunity.com")) {
    const match = input.match(/\/(id|profiles)\/([^\/]+)/);
    if (!match) return null;
    input = match[2];
  }

  // If it’s already a SteamID64 → return it
  if (/^\d{17}$/.test(input)) {
    return input;
  }

  // Otherwise treat as vanity name
  const res = await Axios.get(
    "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/",
    {
      params: {
        key: process.env.STEAM_API_TOKEN,
        vanityurl: input,
      },
    }
  );

  if (res.data.response.success !== 1) {
    throw new Error("Could not resolve vanity URL");
  }

  return res.data.response.steamid;
}

async function getSteamProfileInfo(input) {
  const steamId = await resolveSteamId(input);
  const summary = await Axios.get(
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
    {
      params: {
        key: process.env.STEAM_API_TOKEN,
        steamids: steamId,
      },
    }
  );

  const player = summary.data.response.players[0];
  if (!player) return null;

  // 2. Get playtime
  const games = await Axios.get(
    "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
    {
      params: {
        key: process.env.STEAM_API_TOKEN,
        steamid: steamId,
        include_played_free_games: true,
      },
    }
  );

  // Rust app id
  const rust = games.data.response.games?.find((g) => g.appid === 252490);
  const rustHours = rust ? (rust.playtime_forever / 60).toFixed(1) : 0;

  return {
    steamId,
    name: player.personaname,
    status: player.personastate,
    inGame: player.gameextrainfo || null,
    gameId: player.gameid || null,
    rustHours,
  };
}

module.exports = { getSteamProfileInfo };
