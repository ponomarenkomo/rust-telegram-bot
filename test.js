// const Player = require("./structures/players.js");
const battlemetrics = require("./commands/Battlemetrics.js");
// const Team = require("./commands/teamManager.js");
require("dotenv").config();

class Team {
  constructor(name) {
    this.name = name;
    this.players = {};
  }
}

class Player {
  constructor(steamData) {
    this.steamId = steamData.steamId;
    this.name = steamData.name;
    this.status = steamData.status;
    this.game = steamData.gameextrainfo;
    this.rustHours = steamData.rustHours;
    this.inGame = steamData.gameextrainfo;
    // this.lastSeen = steamData.lastSeen;
  }

  update(steamData) {
    if (!steamData) return;

    this.name = steamData.name || this.name;
    this.status = steamData.status || this.status;
    this.game = steamData.gameId || this.game;
    this.rustHours =
      steamData.rustHours !== undefined ? steamData.rustHours : this.rustHours;
    this.inGame = steamData.inGame || this.inGame;
    // this.lastSeen = steamData.lastSeen || this.lastSeen;
  }
}

class TeamManager {
  constructor() {
    this.teams = {}; // { teamName: Team }
    this.players = {}; // { steamId: Player }
  }

  createTeam(name) {
    if (!this.teams[name]) {
      this.teams[name] = new Team(name);
    }
    return this.teams[name];
  }
  getAllTeams() {
    return Object.values(this.teams);
  }

  addPlayerToTeam(teamName, steamData) {
    const team = this.createTeam(teamName);

    // Создаем Player объект, если его нет
    let player = this.players[steamId];
    if (!player) {
      player = new Player(steamId);
      this.players[steamId] = player;
    }

    // Важно: добавить объект Player, а НЕ строку
    team.players.push(player);

    return team;
  }
}

(async () => {
  const player = new Player({ steamId: "76561198273818482" });
  const steamData = await battlemetrics.getSteamProfileInfo(player.steamId);

  player.update(steamData);

  // console.log(player);
  const manager = new TeamManager();
  team = manager.createTeam("gg");

  console.log(manager.teams);

  team.addPlayerToTeam("gg", steamData);
  // console.log(team.getTeam({ name: "gg" }));
})();
