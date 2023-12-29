const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');


module.exports = {
    data: {
      customId: 'stats',
      type: 'BUTTON',
    },
    async execute(interaction, characterName) {

        try {
          let classCharacter = ["<:attacker:1187450263875887104>", "<:defender:1188203274101346336>", "<:supporter:1188203212117921822>", "<:debuffer:1188203308951805963>", "<:healer:1188203244757983312> "];

          let rarityCharacter = ["<:ssr:1187450231466491925>", "<:sr:1188203116210954300>", "<:r_:1188203165879894097>"];

          let typeCharacter = ["<:power:1187450300324397137>", "<:sense:1188203385837592697>", "<:technique:1188203336269312020>"];

          const response = await axios.get(`https://www.prydwen.gg/black-clover/characters/${characterName}`);
          
          const $ = cheerio.load(response.data);
    
          let nameText = $('.category:contains("Name") + .details').text();
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
          //const raretyText = $('.category:contains("Rarity") + .details').text();
          const typeText = $('.category:contains("Type") + .details').text();
          const classText = $('.category:contains("Class") + .details').text();
          const rarityElement = $('.bcm-rarity.seasonal');
          if (rarityElement.length > 0) {
            nameText = `${nameText} | ${rarityElement.text()}`
          }
          
          
          /*const dataClassValue = $('.section-stats  picture img').attr('data-src');
          const imageRarityUrl = `https://www.prydwen.gg${dataClassValue}`;
          console.log(imageRarityUrl);*/
    
          const atkValue = $('.category:contains("ATK") + .details').text()
          const matkValue = $('.category:contains("M. ATK") + .details').text()
          const defValue = $('.category:contains("DEF") + .details').text()
          const hpValue = $('.category:contains("HP") + .details').text()
          const accValue = $('.category:contains("ACC") + .details').text()
          const dmgRes = $('.category:contains("DMG RES") + .details').text()
          const critRate = $('.category:contains("CRIT Rate") + .details').text()
          const critdmg = $('.category:contains("CRIT DMG") + .details').text()
          const critRes = $('.category:contains("CRIT RES") + .details').text()
          const speed = $('.category:contains("Speed") + .details').text()
          const penetration = $('.category:contains("Penetration") + .details').text()
          const endurance = $('.category:contains("Endurance") + .details').text()
          
          let characterClass = "";
          let characterType = "";

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


          let atkLength = atkValue.length;
          let matkLength = matkValue.length;
          let atk = atkValue.slice(0, atkLength - matkLength)
    
          let desc = `${characterRarety} | ${characterType} **${typeText}** | ${characterClass} **${classText}**\n\n` +
            ":bar_chart: Statistiques. (level 100, LR 5)\n> <:stat_atk:1187450407509835907> ``ATK:`` " + `**${atk}**\n> ` + "<:stat_matk:1187450426031882240>  ``M.ATK:`` " +`**${matkValue}**\n> `+ "<:stat_def:1187450392099958908> ``DEF:`` " + `**${defValue}**\n> `+ "<:stat_hp:1187450363721289870>  ``HP:`` " + `**${hpValue}**\n\n` +
            "> <:stat_acc:1187452987858243715> ``ACC:`` " + `**${accValue}**\n> `+ "<:stat_dmgres:1187452847231619272> ``DMG RES:`` " + `**${dmgRes}**\n> `+ "<:stat_crit:1187452900520251393> ``CRIT Rate:`` " + `**${critRate}**\n> `+ "<:stat_critdmg:1187452880429527131> ``CRIT DMG:`` " + `**${critdmg}**\n\n> `+ "<:stat_critres:1187452966802833519> ``CRIT RES:`` " + `**${critRes}**\n> `+ "<:stat_speed:1187452917234552933> ``Speed:`` " + `**${speed}**\n> `+ "<:stat_pen:1187452931377733764> ``Penetration:`` " + `**${penetration}**\n> `+ "<:stat_end:1187452951644602480> ``Endurance:`` " + `**${endurance}**\n\n\n` +
            ``;
    
          let newDesc = `<:ssr:1187450231466491925> | <:power:1187450300324397137> **${typeText}** | <:attacker:1187450263875887104> **${classText}**\n\n` + "**Statistiques** (level 100, LR 5)\n" +
            "> <:stat_atk:1187450407509835907> ``ATK:`` " + `**${atk}** ` + " | <:stat_acc:1187452987858243715> ``ACC:`` " + `**${accValue}** | ` + "<:stat_critres:1187452966802833519> ``CRIT RES:`` " + `**${critRes}**\n` +
            "> <:stat_matk:1187450426031882240>  ``M.ATK:`` " + `**${matkValue}** ` + " | <:stat_dmgres:1187452847231619272> ``DMG RES:`` " + `**${dmgRes}** | ` + "<:stat_speed:1187452917234552933> ``Speed:`` " + `**${speed}**\n` +
            "> <:stat_def:1187450392099958908> ``DEF:`` " + `**${defValue}** ` + " | <:stat_crit:1187452900520251393> ``CRIT Rate:`` " + `**${critRate}** | ` + "<:stat_pen:1187452931377733764> ``Penetration:`` " + `**${penetration}**\n` +
            "> <:stat_hp:1187450363721289870>  ``HP:`` " + `**${hpValue}** ` + " | <:stat_critdmg:1187452880429527131> ``CRIT DMG:`` " + `**${critdmg}** | ` + "<:stat_end:1187452951644602480> ``Endurance:`` " + `**${endurance}**\n\n`;
    
          
          const infoPassives = $('.skill-box.bcm').length;
    
          desc += "――――――――――――――――――――――――";
    
          const passive = $('.skill-box.bcm').eq(infoPassives - 2);
          let section = passive.find('span').text();
          if (section == "Passive") {
            
            let textPassive = passive.find('.skill-content p:first').text();
            desc += "\n**" + `${section}` +"**\n```" + `${textPassive}` + "```";
            let infoEffect = passive.find('.skill-content .buff-row .bcm-status');
            if (infoEffect.length > 0) {
              desc += "\n**" + `${infoEffect.find('.bcm-status-info h5').text()}` + " :**";
              desc += "\n> " + `${infoEffect.find('.bcm-status-info p').text()}\n`;
            }
    
            desc += "――――――――――――――――――――――――";
          }
    
          const UniquePassive = $('.skill-box.bcm').eq(infoPassives - 1);
          section = UniquePassive.find('span').text();
          textPassive = UniquePassive.find('.skill-content p:first').text();
          desc += "\n**" + `${section}` + "**\n```" + `${textPassive}` + "```";
          infoEffect = UniquePassive.find('.skill-content .buff-row .bcm-status');
          if (infoEffect.length > 0) {
            desc += "\n**" + `${infoEffect.find('.bcm-status-info h5').text()}` + " :**";
            desc += "\n> " + `${infoEffect.find('.bcm-status-info p').text()}\n`;
          }
    
          desc += "――――――――――――――――――――――――";
    
    
          var row = new ActionRowBuilder();
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:1`)
              .setLabel('Skill 1')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:2`)
              .setLabel('Skill 2')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:3`)
              .setLabel('Skills 3')
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId(`skills:${characterName}:4`)
              .setLabel('Skills 4')
              .setStyle("Primary"),
            new ButtonBuilder()
                .setCustomId('gears')
                .setLabel('Gears')
                .setStyle("Secondary")
                .setDisabled(true),
          );
    
          const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${nameText} `)
            .setDescription(`${desc}`)
            .setThumbnail(`${imageUrl}`)
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}` });
    
          await interaction.update({ embeds: [exampleEmbed], components: [row]});
    
        } catch (error) {
          console.error('Error fetching or parsing the HTML:', error);
          await interaction.reply('An error occurred while fetching or parsing the information.');
        }
      },
    };