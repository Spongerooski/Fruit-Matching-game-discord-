import { client } from "./bot.js";
import { gameBegin } from "./game/game.js";
function handleCommands() {
  client.on('messageCreate', msg => {
    const msgArray = msg.content.split(' ')
    if (msgArray[0] === '-chung') {
      switch (msgArray[1]) {
        case 'game': gameBegin(msg)
      }
 
    }
  });
}


export {handleCommands}