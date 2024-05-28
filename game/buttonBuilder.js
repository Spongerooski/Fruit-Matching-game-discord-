import { EmbedBuilder, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, time } from "discord.js"

/**
 * 
 * @param {Array[Array]} buttonArray
 */
function buildButton(buttonArray) {
    let finalButtonArray = []
    for (let i=0; i<=3; i++) {
        let midButtonArray = new ActionRowBuilder()
        for (let j=0; j<=3; j++) {
            let count = 4*i + j
            let elementType = buttonArray[count][1]
            let elementEmoji = buttonArray[count][0]
            let elementButton = new ButtonBuilder().setStyle(ButtonStyle.Secondary)
            .setCustomId(`${elementType} ${i} ${j} ${elementEmoji}`)
            switch (elementType) {
                case 'A':
                    elementButton.setEmoji(elementEmoji)
                    break
                case 'B':
                    elementButton.setLabel('​')
                    break
                case 'C':
                    elementButton.setEmoji(elementEmoji)
                    break
            }

            midButtonArray.addComponents(elementButton)
        }
        finalButtonArray.push(midButtonArray)
    }
    return finalButtonArray
}
export {buildButton}