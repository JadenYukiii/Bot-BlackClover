const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    data: {
      customId: 'skills', // L'ID personnalisé de votre bouton
      type: 'BUTTON', // Le type de bouton (dans ce cas, un bouton)
    },
    async execute(interaction, characterName, numSkill) {

      try {
        let classCharacter = ["<:attacker:1187450263875887104>", "<:defender:1188203274101346336>", "<:supporter:1188203212117921822>", "<:debuffer:1188203308951805963>", "<:healer:1188203244757983312> "];

        let rarityCharacter = ["<:ssr:1187450231466491925>", "<:sr:1188203116210954300>", "<:r_:1188203165879894097>"];

        let typeCharacter = ["<:power:1187450300324397137>", "<:sense:1188203385837592697>", "<:technique:1188203336269312020>"];
        
        const response = await axios.get(`https://www.prydwen.gg/black-clover/characters/${characterName}`);
        
        const $ = cheerio.load(response.data); 

        
  
        let nameText = $('.category:contains("Name") + .details').text();
        const typeText = $('.category:contains("Type") + .details').text();
        const classText = $('.category:contains("Class") + .details').text();
        const imagePerso = $('#section-gallery picture img').attr('data-src');
        const rarityElement = $('.bcm-rarity.seasonal');
        let dataSrcValue = $(`.avatar.bcm.SSR picture img[alt="${nameText}"]`).attr('data-src');
        let characterRarety = rarityCharacter[0];
        if (dataSrcValue == undefined) {
          dataSrcValue = $(`.avatar.bcm.SR picture img[alt="${nameText}"]`).attr('data-src');
          characterRarety = rarityCharacter[1];
          if (dataSrcValue == undefined) {
            dataSrcValue = $(`.avatar.bcm.R picture img[alt="${nameText}"]`).attr('data-src');
            characterRarety = rarityCharacter[2];
          }
        }
        
        const imageUrl = `https://www.prydwen.gg${dataSrcValue}`;

        if (rarityElement.length > 0) {
          nameText = `${nameText} | ${rarityElement.text()}`
        }

        if (typeText == "Power") {
          characterType = typeCharacter[0];
        } else if (typeText == "Sense") {
          characterType = typeCharacter[1];
        } else characterType = typeCharacter[2];

        if (classText == "Attacker") {
          characterClass = classCharacter[0];
        } else if (classText == "Defender") {
          characterClass = classCharacter[1];
        } else if (classText == "Supporter") {
          characterClass = classCharacter[2];
        } else if (classText == "Debuffer") {
          characterClass = classCharacter[3];
        } else characterClass = classCharacter[4];
        
        
        const infoSkill = $('.skill-box.bcm').eq(numSkill - 1);
        const infoSkillName = infoSkill.find('.name').text();
  
        let desc = `${characterRarety} | ${characterType} **${typeText}** | ${characterClass} **${classText}**\n\n`;
        
        desc += "**" + `${infoSkillName}` + "** (" + `${infoSkill.find('.pills .skill-type.pill').eq(0).text()}`;
  
        if (infoSkill.find('.pills span').length == 2) {
          desc += ` | ${infoSkill.find('.pills span').eq(1).text()})`;
        } else if (infoSkill.find('.pills span').length == 4) {
          desc += ` | ${infoSkill.find('.pills span').eq(1).text()}`;
          desc += ` | ${infoSkill.find('.pills span').eq(2).text()}`;
          desc += ` | ${infoSkill.find('.pills span').eq(3).text()})`;
  
        } else desc += ")";
  
        const skillContent3 = infoSkill.find('.skill-content p:first').text();
        const skillContent = infoSkill.find('.skill-content ul li');
  
        desc += "\n```" + `${skillContent3}` + "```";

        for (let i = 0; i < skillContent.length; i++) {
          desc += "\n**- " + `${skillContent.eq(i).text()}` + "**";
        }
  
        desc += "――――――――――――――――――――――――";
  
        const upgradeSkill = infoSkill.find('.skill-content .upgrades');
  
        for (let i = 0; i < upgradeSkill.length; i++) {
          desc += "```"
          desc += "\n" + `${upgradeSkill.eq(i).text()}`;
          desc += "```"
        }
  
        desc += "――――――――――――――――――――――――";
  
        const infoEffect = infoSkill.find('.skill-content .buff-row .bcm-status');
        for (let i = 0; i < infoEffect.length; i++) {
          desc += "\n**" + `${infoEffect.find('.bcm-status-info h5').eq(i).text()}` + " :**";
          desc += "\n> " + `${infoEffect.find('.bcm-status-info p').eq(i).text()}\n`;
        }

        desc += "――――――――――――――――――――――――";
  
        var row = new ActionRowBuilder();
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`stats:${characterName}`)
            .setLabel('Statistiques')
            .setStyle("Success"),
        );
  
        if(numSkill == 1) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:2`)
              .setLabel('Skills 2')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:3`)
              .setLabel('Skills 3')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:4`)
              .setLabel('Skills 4')
              .setStyle("Primary"),
          );
        } else if(numSkill == 2) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:1`)
              .setLabel('Skills 1')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:3`)
              .setLabel('Skills 3')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:4`)
              .setLabel('Skills 4')
              .setStyle("Primary"),
          );
        } else if(numSkill == 3) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:1`)
              .setLabel('Skills 1')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:2`)
              .setLabel('Skills 2')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:4`)
              .setLabel('Skills 4')
              .setStyle("Primary"),
          );
        } else if(numSkill == 4) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:1`)
              .setLabel('Skills 1')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:2`)
              .setLabel('Skills 2')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:3`)
              .setLabel('Skills 3')
              .setStyle("Primary"),
          );
        }

        row.addComponents(
          new ButtonBuilder()
            .setCustomId('gears')
            .setLabel('Gears')
            .setStyle("Secondary")
            .setDisabled(true),
        );
  
        // Créer un embed Discord
        const exampleEmbed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(`${nameText} `)
          .setDescription(`${desc}`)
          .setThumbnail(`${imageUrl}`)
          //.setImage(`${imageUrl}`)
          .setTimestamp()
          .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}` });
  
        // Envoyer la réponse avec l'objet MessagePayload
        await interaction.update({ embeds: [exampleEmbed], components: [row]});
  
      } catch (error) {
        console.error('Error fetching or parsing the HTML:', error);
        await interaction.reply('An error occurred while fetching or parsing the information.');
      }
    },
  };