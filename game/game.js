import { client } from "../bot.js"
import { buildButton } from "./buttonBuilder.js";
import { EmbedBuilder, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, time, ActionRow } from "discord.js"

/**
 * 
 * @param {Message<Boolean>} msg 
 */
async function gameBegin(msg) {

    let buttonArray = shuffleArray([['🍎', 'B'], ['🍊', 'B'], ['🍈', 'B'], ['🍇', 'B'], ['🍉', 'B'], ['🍋', 'B'], ['🍌', 'B'], ['🍍', 'B'], ['🍎', 'B'], ['🍊', 'B'], ['🍈', 'B'], ['🍇', 'B'], ['🍉', 'B'], ['🍋', 'B'], ['🍌', 'B'], ['🍍', 'B']])
    const msgSent = await msg.channel.send({components: buildButton(buttonArray), content: `Fruit Matching for ${msg.member}`})
    const collector = msgSent.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000 })
    
    collector.on('collect', async i => {
        // handle interaction on the button which is already 'C' or 'A'
        const userBegin = collector.options.message.content.split(' ')[3]
        if (`<@${i.member.user.id}>` === userBegin) {
            let resolvedButtons = resolveButtons(i.message.components)
            const clicked = i.component.customId.split(' ')
            const indexOfClick = 4*(parseInt(clicked[1])) + parseInt(clicked[2])
            if (resolvedButtons[indexOfClick][1] === 'A'||resolvedButtons[indexOfClick][1] === 'C') {
                i.reply(`${i.user}, That Component is already revealed`)
            } else {
                const clickedRequired = [clicked[3], clicked[0]]
                let typeArray = []; let emojiArray = []
                resolvedButtons.forEach((button) => {
                    typeArray.push(button[1]); emojiArray.push(button[0])
                })
                const firstA = typeArray.indexOf('A')
                const lastA = typeArray.lastIndexOf('A')
                if (firstA < 0) {
                    resolvedButtons[indexOfClick] = [clickedRequired[0], 'A']
                    await i.update({components: buildButton(resolvedButtons)})
                } else if (firstA === lastA) {
                    // only one A, if the interaction and this A match, update making it C, otherwise resolve to B
                    if (clickedRequired[0] === resolvedButtons[firstA][0]) {
                        resolvedButtons[firstA][1] = 'C'
                        resolvedButtons[indexOfClick][1] = 'C'
                        typeArray[firstA] = 'C'
                        typeArray[indexOfClick] = 'C'
                        console.log(typeArray)
                        const fullArray = [
                            'C', 'C', 'C', 'C',
                            'C', 'C', 'C', 'C',
                            'C', 'C', 'C', 'C',
                            'C', 'C', 'C', 'C'
                          ]
                        const equalArrays = (typeArray.length === fullArray.length) && typeArray.every((value, index) => value === fullArray[index]);
                        if (equalArrays)
                            {
                                await i.update({components: [], content: `Yay! ${i.user} matched all the fruits in given time`});
                                collector.removeAllListeners()
                            }
                        else { await i.update({ components: buildButton(resolvedButtons) }) }
                    } else {
                        resolvedButtons[indexOfClick][1] = 'A'
                        i.update({ components: buildButton(resolvedButtons) })
                    }
                } else if (firstA!== lastA) {
                    // make firstA and lastA both B and make the selection c
                    resolvedButtons[firstA][1] = 'B'
                    resolvedButtons[lastA][1] = 'B'
                    resolvedButtons[indexOfClick][1] = 'A'
                    await i.update({ components: buildButton(resolvedButtons) })
                }
            }
        } else {
            i.reply (`${i.user}, This Fruit Matching is not for you, To start your own Fruit Matching type '-chung game'}`)
        }
 
    })

    collector.on('end', async interaction => {
        const user = collector.options.message.content.split(' ')[3]
        await collector.options.message.edit({ components: [] , content: `${user} failed to Match the fruits within 2 minutes` })
    })
}

export {gameBegin}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

/**
 * 
 * @param {Array[ActionRow]} actionRowArray 
 */
function resolveButtons(actionRowArray) {
    let finalArray = []
    for (let i=0; i<=3; i++) {
        actionRowArray[i].components.forEach(element => {
            let splittedCustomIds = element.customId.split(' ')
            finalArray.push([splittedCustomIds[3], splittedCustomIds[0]])
        });
    }
    return finalArray
}

function indexModifier (index) {
    const remainder = index % 4
    return [(index - remainder)/4 , remainder]
}
