const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, Util } = require('discord.js');
const member = new Discord.Client();
const cmd = new Discord.Client();
const config = require('./config.json');
const prefix = config.prefix;
const maincolor = config.Maincolor;
const seccolor = config.Seccolor;
const levelcolor = config.levelcolor;
const leveling = require('./leveling.json')
const maxlevel = leveling.maxlevel;
const footer = config.footer;
const logo = config.logourl;
const bot = new Discord.Client({disableEveryone: true});
const moment = require('moment');
const fs = require("fs");
let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));
//////////////////
//   functions
function getJoinRank(ID, guild) { // Call it with the ID of the user and the guild
    if (!guild.member(ID)) return; // It will return undefined if the ID is not valid

    let arr = guild.members.array(); // Create an array with every member
    arr.sort((a, b) => a.joinedAt - b.joinedAt); // Sort them by join date

    for (let i = 0; i < arr.length; i++) { // Loop though every element
      if (arr[i].id == ID) return i; // When you find the user, return it's position
    }
}

function getremaininglevels(level) {
  if (level == 0) {
    return leveling.level1;
  }
  if (level == 1) {
    return leveling.level2;
  } 
  if (level == 2 ) {
    return leveling.level3;
  }
  if (level == 3) {
    return leveling.level4;
  }
  do {
    i + 1
  } while (i < maxlevel)
}


//////////////////
client.setMaxListeners(30);

client.on('ready', () => {
    const Bot_A = prefix + "help";
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(Bot_A);
  });
// Leveling

client.on("message", message => {
  if (message.author.bot) return; // ignore bots

  // if the user is not on db add the user and change his values to 0
  if (!db[message.author.id]) db[message.author.id] = {
      xp: 0,
      level: 0
    };
  db[message.author.id].xp++;
  let userInfo = db[message.author.id];
  var i = 0
  if(userInfo.xp > leveling.level1 && userInfo.level < 1) {
    do {
      userInfo.level++
      userInfo.xp = 0
      message.reply("Congratulations, you leveled up to " + "**" + "Level" + userInfo.level + "!" + "**")
      i++
    } while (i < maxlevel)
  }
  if(userInfo.xp > leveling.level2 && userInfo.level < 2) {
    userInfo.level++
    userInfo.xp = 0
    message.reply("Congratulations, you leveled up to " + "**" + "Level" + userInfo.level + "!" + "**")
  }
  if(userInfo.xp > leveling.level3 && userInfo.level < 3) {
    userInfo.level++
    userInfo.xp = 0
    message.reply("Congratulations, you leveled up to " + "**" + "Level" + userInfo.level + "!" + "**")
  }
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if(message.content.startsWith(prefix + "info")) {
      let userInfo = db[message.author.id];
      let member = message.mentions.members.first();
      let embed = new Discord.RichEmbed()
      .setColor(levelcolor)
      .addField("Level", userInfo.level)
      .addField("XP", userInfo.xp + " / " + getremaininglevels(userInfo.level));
      if(!member) return message.channel.send(embed)
      let memberInfo = db[member.id]
      if (memberInfo == null) return message.channel.send("No Data found for this user, looks like he hasn't sent any messages yet :(")
      else if (memberInfo != null) {  
      let embed2 = new Discord.RichEmbed()
      .setColor(levelcolor)
      .addField("Level", memberInfo.level)
      .addField("XP", memberInfo.xp + " / " + getremaininglevels(memberInfo.level))
      message.channel.send(embed2)
      }
  }
  fs.writeFile("./database.json", JSON.stringify(db), (x) => {
      if (x) console.error(x)
    });
})


// whoami command

client.on('message', message => {
    const user = message.mentions.users.first() || message.author;
    const thisguild  = message.guild;   
    const owner      = thisguild.owner.user.username;
    const joinServer = moment(user.joinedAt).format('llll');
    const joinDiscord = moment(user.createdAt).format('llll');
    const name = `${message.author.username}#${message.author.discriminator}`
    const authorid = message.author.id
    const position = getJoinRank(authorid, thisguild)
    if (message.content.startsWith(prefix + "whoami") && message.author.username != owner) {
      // Send the user's avatar URL
      let member = message.guild.member(user);
      let memberavatar = message.author.avatarURL;
      let embed = new Discord.RichEmbed()
      .setColor(seccolor)
      .setThumbnail(memberavatar)
      .setDescription(name)
      .setTitle("Whoami report for:")
      .addField("Joined at:", joinServer, true)
      .addField('Join Position:', position, true)
      .addField("Account created:", joinDiscord, true)
      .addField("Roles:", message.guild.member(user).roles.map(r => `${r}`).join(' | '), true)
      .addField("Nickname:", `${message.guild.member(user).nickname !== null ? `${message.guild.member(user).nickname}` : 'None'}`, true)
      .setFooter(footer)
      if (member.presence.game) 
            embed.addField("Currently playing:", `${member.presence.game.name}`, true);
      message.channel.send(embed);
    } else if (message.content.startsWith(prefix + "whoami") && message.author.username == owner) {
        message.channel.send("root");
    }
  });



// FAQ

  client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "faq" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("FAQ")
		.setColor(maincolor)
        .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/plugins/commandpanels/faq')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });

// Commands & Permissions

  client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "commands" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Commands & Permissions")
		.setColor(maincolor)
        .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/plugins/commandpanels/commands-and-permissions')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });

  client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "permissions" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Commands & Permissions")
		.setColor(maincolor)
        .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/plugins/commandpanels/commands-and-permissions')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });

//placeholders & panelEditing


  client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "placeholders" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Placeholders & Panel Editing")
		.setColor(maincolor)
        .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/plugins/commandpanels/placeholders-and-panel-editing')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });

// Command tags

client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "commandtags" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Panel Command Tags")
		.setColor(maincolor)
        .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/plugins/commandpanels/panel-tags')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });

// Editor

client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "editor" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Command Panels Editor")
        .setColor(maincolor)
        .addField('>> Heres the download link I found:', 'https://www.spigotmc.org/resources/command-panels-editor-custom-guis.71184/')
        .addField('>> Heres the wiki page I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/plugins/commandpanels/placeholders-and-panel-editing')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });
  
// config section

client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "config" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Configuration")
		.setColor(maincolor)
        .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/plugins/commandpanels/configuration')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });

// videos

client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "videos" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Videos")
		.setColor(maincolor)
        .addField('>> English Variant (by SoulStriker):', 'https://youtu.be/W5PhsQxzGxM')
        .addField('>> Dutch Variant (by The BelgiumGames):', 'https://youtu.be/Yz_V0b-UFh4')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });

// generator

client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "generate" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Generate Panels")
		.setColor(maincolor)
        .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/plugins/commandpanels/generate-panels')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });
  
// panel signs

client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "signs" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Placeholders & Panel Editing")
		.setColor(maincolor)
        .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/plugins/commandpanels/panel-signs')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });
  
// links

client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "links" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(logo)
        .setTitle("Links:")
		.setColor(maincolor)
        .addField('>> Wiki Link:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/')
        .addField('>> Download Link Plugin:', 'https://www.spigotmc.org/resources/command-panels-custom-guis.67788/')
        .addField('>> Download Link Editor:', 'https://www.spigotmc.org/resources/command-panels-editor-custom-guis.71184/')
        .addField('>> Download Link Quick Save:', 'https://www.spigotmc.org/resources/quick-save-auto-world-backups.75871/')
        .setFooter(footer)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });

// quicksave config

client.on('message', msg => {
      
  if (msg.content.startsWith(prefix + "qsconfig" ))  {
      let embed = new Discord.RichEmbed()
      .setThumbnail(logo)
      .setTitle("Quick Save Configuration")
  .setColor(maincolor)
      .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/quick-save-wiki/configuration')
      .setFooter(footer)
      .setTimestamp()
  msg.channel.send(embed);
  }
  
});

// quicksave commands

client.on('message', msg => {
      
  if (msg.content.startsWith(prefix + "qscommands" ))  {
      let embed = new Discord.RichEmbed()
      .setThumbnail(logo)
      .setTitle("Quick Save Commands")
  .setColor(maincolor)
      .addField('>> Heres what I found:', 'https://rockyhawk99.gitbook.io/rockyhawk-wiki/quick-save-wiki/commands-and-permissions')
      .setFooter(footer)
      .setTimestamp()
  msg.channel.send(embed);
  }
  
});

// qs return

client.on('message', msg => {
      
  if (msg.content.startsWith(prefix + "qswiki" ))  {
      let embed = new Discord.RichEmbed()
      .setThumbnail(logo)
      .setTitle("Quick Save Wiki")
      .setDescription("Available commands:")
  .setColor(maincolor)
      .addField('>> Configuration:', '>> ' + prefix + 'qsconfig')
      .addField('>> Commands:', '>> ' + prefix + 'qscommands')
      .setFooter(footer)
      .setTimestamp()
  msg.channel.send(embed);
  }
  
});

// Prefix Command
  
  client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "prefix" ))  {

    msg.channel.send("My prefix here is:  " + prefix + "example");
    } else if (msg.content.startsWith("!prefix")) {
        msg.channel.send("My prefix here is:  " + prefix + "example");
    } else if (msg.content.startsWith("?prefix")) {
        msg.channel.send("My prefix here is:  " + prefix + "example");
    } else if (msg.content.startsWith("$prefix")) {
        msg.channel.send("My prefix here is:  " + prefix + "example");
    } else if (msg.content.startsWith("%prefix")) {
        msg.channel.send("My prefix here is:  " + prefix + "example");
    }
    
  });






// Help Command

client.on('message', msg => {
      
    if (msg.content.startsWith(prefix + "help" ))  {
        let embed = new Discord.RichEmbed()
        .setThumbnail(msg.author.avatarURL)
        .setTitle("**Available Commands:**")
        .setColor(seccolor)
        .addField("Display the FAQ wiki page:", ">> " + prefix + "faq")
        .addField("Display the commands and permission wiki page:", ">> " + prefix + "commands")
        .addField("Display information about placeholders and panel editing", ">> " + prefix + "placeholders")
        .addField("Display information about Command Tags", ">> " + prefix + "commandtags")
        .addField("Display information about the editor", ">> " + prefix + "editor")
        .addField("Display information about how to configure the plugin",  ">> " + prefix + "config")
        .addField("Display links to helpful videos", ">> " + prefix + "videos")
        .addField("Display information about how to generate panels", ">> " + prefix + "generate")
        .addField("Display information about panel signs", ">> " + prefix + "signs")
        .addField("Get the latest download links", ">> " + prefix + "links")
        .addField("Get information about quicksave", ">> " + prefix + "qs")
        .addField("Display information about your account:", ">> " + prefix + "whoami")
        .addField("My Prefix:", ">> " + prefix)
        .setFooter(`Replying to ${msg.author.username}#${msg.author.discriminator}`)
        .setTimestamp()
    msg.channel.send(embed);
    }
    
  });

// Login
client.login(config.token);
