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

async function scrapeSteamProfileName(steamId) {
  const url = `https://steamcommunity.com/profiles/${steamId}`;
  const response = await Axios.get(url);

  if (response.status !== 200) {
    console.log("error");
    return null;
  }

  let regex = new RegExp(`class="actual_persona_name">(.+?)</span>`, "gm");
  let data = regex.exec(response.data);
  if (data) {
    return decodeHtml(data[1]);
  }

  return null;
}

module.exports = { scrapeSteamProfileName };

