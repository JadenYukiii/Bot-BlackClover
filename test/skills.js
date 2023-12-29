const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const skills = require('../../buttons/skills');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skills')
    .setDescription('Obtain info for Black Clover character')
    .addStringOption(option =>
      option.setName('name')
        .setDescription("The caractere's name")
        .setRequired(true)),
  async execute(interaction) {

    try {
      const name = interaction.options.getString('name')

      // Faire la requête HTTP à la page
      const response = await axios.get('https://www.prydwen.gg/black-clover/characters/');
      
      // Charger le contenu HTML avec Cheerio
      const $ = cheerio.load(response.data);

      let search = $(`.avatar-card.card`);
      let count = 0;
      let desc = "";
      var row = new ActionRowBuilder();
      
      for (let i = 0; i < search.length; i++) {
        const nameText = $(search[i]).find('.emp-name').text();
        if (nameText.toLowerCase().includes(name.toLowerCase())) {
          count = count + 1;
          const ssr = $(search[i]).find('.avatar.bcm.SSR.true');
          const sr = $(search[i]).find('.avatar.bcm.SR.true');
          const r = $(search[i]).find('.avatar.bcm.R.true');

          if (ssr.length > 0) {
            var rarity = "SSR";
          } else if (sr.length > 0) {
            var rarity = "SR";
          }
          else if (r.length > 0) {
            var rarity = "R";
          }

          desc += `**Rarity :** ${rarity}\n`;
          desc += "```" + `- ${nameText}` + "```\n";

          const link = $(search[i]).find('a').attr('href').split('/')[3];
          row.addComponents(
            new ButtonBuilder()
              .setCustomId('stats:' + `${link}`)
              .setLabel(`${nameText}`)
              .setStyle("Primary"))
        }
      }

      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`**Number of character found :** ${count}`)
        .setDescription(`${desc}`)
        .setTimestamp()
        .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}` });

      
      await interaction.reply({ embeds: [exampleEmbed], components: [row]});

    } catch (error) {
      console.error('Error fetching or parsing the HTML:', error);
      await interaction.reply('An error occurred while fetching or parsing the information.');
    }
  },
};