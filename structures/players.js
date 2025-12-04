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

// class Player {
//   constructor(steamProfile) {
// this.steamId = steamProfile.steamId.toString();
// this.name = steamProfile.name;
// this.status = steamProfile.status;
// this.game = steamProfile.game;
// this.lastSeen = steamProfile.lastlogoff;

//     // Track previous state to detect changes
//     this.prevStatus = null;
//   }

// update(steamData) {
//   this.prevStatus = this.status;

//   this.name = steamData.personaname;
//   this.status = steamData.personastate;
//   this.game = steamData.gameextrainfo || null;
//   this.lastSeen = steamData.lastlogoff || null;
// }

//   get hasStatusChanged() {
//     return this.prevStatus !== null && this.prevStatus !== this.status;
//   }
// }

module.exports = Player;
