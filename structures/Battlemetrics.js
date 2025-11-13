const Axios = require("axios");
const Fs = require("fs");
const Path = require("path");

const steamId = "76561198273818482";
const STEAM_PROFILES_URL = "https://steamcommunity.com/profiles/";

const url = `https://steamcommunity.com/profiles/${steamId}`;

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

async function scrapeSteamProfileName() {
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

async function main() {
  const name = await scrapeSteamProfileName();
  console.log("Steam name:", name);
}

main();
