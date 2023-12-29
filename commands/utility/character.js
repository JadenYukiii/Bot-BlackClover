const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('character')
    .setDescription('Obtain info for Black Clover character')
    .addStringOption(option =>
      option.setName('name')
        .setDescription("The caractere's name")
        .setRequired(true)),
        async execute(interaction) {

          try {
            await interaction.deferReply();
            let classCharacter = ["<:attacker:1187450263875887104>", "<:defender:1188203274101346336>", "<:supporter:1188203212117921822>", "<:debuffer:1188203308951805963>", "<:healer:1188203244757983312> "];
  
            let rarityCharacter = ["<:ssr:1187450231466491925>", "<:sr:1188203116210954300>", "<:r_:1188203165879894097>"];
  
            let typeCharacter = ["<:power:1187450300324397137>", "<:sense:1188203385837592697>", "<:technique:1188203336269312020>"];

            const name = interaction.options.getString('name')
      
            const response = await axios.get('https://www.prydwen.gg/black-clover/characters/');
            
            const $ = cheerio.load(response.data);
      
            let search = $(`.avatar-card.card`);
            let count = 0;
            let desc = "";
            var row = new ActionRowBuilder();
            let characterClass = "";
            let characterType = "";
            let newNameText = "";
            
            for (let i = 0; i < search.length; i++) {
              const nameText = $(search[i]).find('.emp-name').text();
              if (nameText.toLowerCase().includes(name.toLowerCase())) {
                count = count + 1;
                const ssr = $(search[i]).find('.avatar.bcm.SSR.true');
                const sr = $(search[i]).find('.avatar.bcm.SR.true');
                const r = $(search[i]).find('.avatar.bcm.R.true');
                const link = $(search[i]).find('a').attr('href').split('/')[3];

                const perso = await axios.get(`https://www.prydwen.gg/black-clover/characters/${link}`);
                const gg$ = cheerio.load(perso.data);
                
                const typeText = gg$('.category:contains("Type") + .details').text();
                const classText = gg$('.category:contains("Class") + .details').text();
                const rarityElement = gg$('.bcm-rarity.seasonal');
                if (rarityElement.length > 0) {
                  newNameText = `${nameText} | ${rarityElement.text()}`
                } else newNameText = nameText;

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
      
                if (ssr.length > 0) {
                  var rarity = rarityCharacter[0];
                } else if (sr.length > 0) {
                  var rarity = rarityCharacter[1];
                }
                else if (r.length > 0) {
                  var rarity = rarityCharacter[2];
                }
      
                desc += `${rarity} | ${characterType} ${typeText} | ${characterClass} ${classText}\n`;
                desc += "```" + `- ${newNameText}` + "```\n";
      
                row.addComponents(
                  new ButtonBuilder()
                    .setCustomId('stats:' + `${link}`)
                    .setLabel(`${nameText}`)
                    .setStyle("Primary"))
              }
            }
      
            const characterEmbed = new EmbedBuilder()
              .setColor(0x0099FF)
              .setTitle(`**Number of character found :** ${count}`)
              .setDescription(`${desc}`)
              .setTimestamp()
              .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}` });
      
            
            await interaction.editReply({ embeds: [characterEmbed], components: [row]});
      
          } catch (error) {
            console.error('Error fetching or parsing the HTML:', error);
            await interaction.reply('An error occurred while fetching or parsing the information.');
          }
        },
      };