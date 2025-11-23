const axios = require("axios");

class SteamTracker {
  constructor(apiKey, teamManager) {
    this.apiKey = apiKey;
    this.teamManager = teamManager;
    this.interval = null;
    this.listeners = [];
  }

  onStatusChange(callback) {
    this.listeners.push(callback);
  }

  async poll() {
    const ids = this.teamManager.allSteamIds();
    if (ids.length === 0) return;

    const url =
      "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/";

    const response = await axios.get(url, {
      params: {
        key: this.apiKey,
        steamids: ids.join(","),
      },
    });

    const players = response.data.response.players;
    const map = new Map(players.map((p) => [p.steamid, p]));

    for (const user of this.teamManager.getAllUsers()) {
      const steamData = map.get(user.steamId);
      if (!steamData) continue;

      user.update(steamData);

      if (user.hasStatusChanged) {
        this.listeners.forEach((fn) => fn(user));
      }
    }
  }

  start(intervalMs = 60000) {
    this.interval = setInterval(() => this.poll(), intervalMs);
    this.poll();
  }

  stop() {
    clearInterval(this.interval);
  }
}

module.exports = SteamTracker;
