const { Client, GatewayIntentBits } = require("discord.js");
const { registerCommands } = require("./commands");
const Tesseract = require("tesseract.js");
const fs = require("fs-extra");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: ["CHANNEL", "USER", "MESSAGE"]
});

const BOT_TOKEN = process.env.BOT_TOKEN;
const CONFIG_PATH = path.join(__dirname, "config.json");

let configs = {};
if (fs.existsSync(CONFIG_PATH)) {
  configs = fs.readJsonSync(CONFIG_PATH);
}

// ===================== CHANNEL LINKS =====================
const LINKS = {
  rules: "https://discord.com/channels/1447945093410717790/1447962379718492284",
  verify: "https://discord.com/channels/1447945093410717790/1448330472361951333",
  ticket: "https://discord.com/channels/1447945093410717790/1448391461719642262",
  fort: "https://discord.com/channels/1447945093410717790/1448316740147744918",
  announcement: "https://discord.com/channels/1447945093410717790/1447962520026484736",
  kingdomChat: "https://discord.com/channels/1447945093410717790/1447945095037976731",
  resource: "https://discord.com/channels/1447945093410717790/1448391436247498802",
  suggestion: "https://discord.com/channels/1447945093410717790/1447966582818209853",
  question: "https://discord.com/channels/1447945093410717790/1447967131991019690"
};

const KING_IDS = [
  "537505308256370688",
  "826581562891960341"
];

const COUNCIL_IDS = [
  "826581562891960341",
  "537505308256370688",
  "1398965375781175418",
  "888088767561347092",
  "151495610720190464",
  "1342106477019791500",
  "939266674648027176",
  "1191418729410609222"
];

const DEVELOPER_NAME = "Mr Edd (end.is.near_)";

const joinTimes = new Map();

// ================= READY =================
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  await registerCommands(client.user.id, BOT_TOKEN);
});

// ================= SETUP COMMAND =================
client.on("interactionCreate", async (interaction) => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setup") {

    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({ content: "❌ Admin only command.", ephemeral: true });
    }

    const verifiedRole = interaction.options.getRole("verified_role");
    const verifyChannel = interaction.options.getChannel("verify_channel");
    const logChannel = interaction.options.getChannel("log_channel");

    configs[interaction.guild.id] = {
      verifiedRoleId: verifiedRole.id,
      verifyChannelId: verifyChannel.id,
      logChannelId: logChannel.id
    };

    await fs.writeJson(CONFIG_PATH, configs, { spaces: 2 });

    return interaction.reply({
      content: "✅ Verification system setup successfully for this server!",
      ephemeral: true
    });
  }
});

// ================= AUTO ALLIANCE VERIFICATION =================
const allowedAlliances = [
  "astral desire",
  "astral vortex",
  "astral shogun",
  "astral origin"
];

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  // AUTO VERIFY SYSTEM
  if (message.guild) {

    const guildConfig = configs[message.guild.id];
    if (guildConfig && message.channel.id === guildConfig.verifyChannelId && message.attachments.size > 0) {

      const attachment = message.attachments.first();
      if (!attachment.contentType?.startsWith("image")) return;

      await message.reply("🔍 Reading screenshot... please wait (10-20 sec)");

      try {
        const result = await Tesseract.recognize(attachment.url, "eng");
        const text = result.data.text.toLowerCase();
        const member = await message.guild.members.fetch(message.author.id);

        if (member.roles.cache.has(guildConfig.verifiedRoleId)) {
          return message.reply("⚠️ You are already verified.");
        }

        let foundAlliance = null;
        for (const alliance of allowedAlliances) {
          if (text.includes(alliance)) {
            foundAlliance = alliance;
            break;
          }
        }

        if (!foundAlliance) {
          return message.reply("❌ Alliance not recognized. Make sure full profile screenshot is visible.");
        }

        await member.roles.add(guildConfig.verifiedRoleId);

        const prettyName = foundAlliance
          .split(" ")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        await message.reply(
`✅ Verified successfully as **${prettyName}**
🎉 Feel free to explore all channels.`
        );

        const logChannel = message.guild.channels.cache.get(guildConfig.logChannelId);
        if (logChannel) {
          logChannel.send(`✅ ${member.user.tag} verified as ${prettyName}`);
        }

      } catch (err) {
        console.error("OCR Error:", err);
        message.reply("⚠️ Error reading screenshot. Try again with clearer image.");
      }
    }
  }

  // DM SYSTEM (UNCHANGED)
  if (!message.guild) {

    const msg = message.content.toLowerCase();

    if (msg.includes("verify") || msg.includes("verification")) {
      return message.channel.send(
`✅ **How to Get Verified**
Send your in-game account screenshot here:
${LINKS.verify}`
      );
    }

    if (msg.includes("ticket") || msg.includes("leadership") || msg.includes("contact")) {
      return message.channel.send(
`🎫 **Contact Leadership or For anything**
Open a ticket here:
${LINKS.ticket}`
      );
    }

    if (msg.includes("king")) {
      const guild = client.guilds.cache.first();
      const kingNames = await fetchDisplayNames(guild, KING_IDS);
      return message.channel.send(`👑 **Current Kings**\n${kingNames}`);
    }

    if (msg.includes("council")) {
      const guild = client.guilds.cache.first();
      const councilNames = await fetchDisplayNames(guild, COUNCIL_IDS);
      return message.channel.send(`🏛️ **Council Members**\n${councilNames}`);
    }

    if (msg.includes("fort")) {
      return message.channel.send(`🏰 **Fort Status**\n${LINKS.fort}`);
    }

    if (msg.includes("announce")) {
      return message.channel.send(`📢 **Kingdom Announcements**\n${LINKS.announcement}`);
    }

    if (msg.includes("chat") || msg.includes("talk")) {
      return message.channel.send(`🗣️ **Kingdom Chat**\n${LINKS.kingdomChat}`);
    }

    if (msg.includes("resource") || msg.includes("rss")) {
      return message.channel.send(`💎 **Resources / RSS**\n${LINKS.resource}`);
    }

    if (msg.includes("suggest")) {
      return message.channel.send(`💡 **Suggestions**\n${LINKS.suggestion}`);
    }

    if (msg.includes("developer") || msg.includes("bot")) {
      return message.channel.send(`👨‍💻 **Bot Developer**\n${DEVELOPER_NAME}`);
    }

    return message.channel.send(
`❓ I couldn’t understand that.

You can ask about:
• verification  
• ticket / leadership  
• king / council  
• fort status  
• resources  
• announcements  

Or ask here:
${LINKS.question}`
    );
  }
});

// ================= WELCOME DM (UNCHANGED) =================
client.on("guildMemberAdd", async (member) => {
  const username = member.displayName;
  joinTimes.set(member.id, Date.now());

  try {
    await member.send(`**📩 Welcome & Verification Guidelines**

Hello **${username}**, Welcome to Kingdom 3961 Server 👋

To ensure smooth coordination and discipline, please follow the steps below:

**📜 Step 1: Read the Rules**
Before participating, you must read and understand our rules.
➡️ Rules Channel: https://discord.com/channels/1447945093410717790/1447962379718492284
Failure to follow the rules may lead to warnings or removal.

**✅ Step 2: Verification Required**
To get full access to the server, you need to verify yourself.
➡️ Verification Channel: https://discord.com/channels/1447945093410717790/1448330472361951333
📸 Please send a screenshot/image of your in-game account as instructed.
Once verified, you will receive the Verified role and unlock all alliance channels.

**⚠️ Important Notes**
• Do not DM staff unless instructed
• Follow leadership directions at all times
• Leaks, spying, or rule violations are strictly punished

If you have questions, wait until verification is complete.
— Kingdom 3961 Leadership`);
  } catch {}
});

// ================= VERIFIED ROLE DM (UNCHANGED) =================
client.on("guildMemberUpdate", async (oldMember, newMember) => {

  const guildConfig = configs[newMember.guild.id];
  if (!guildConfig) return;

  if (
    !oldMember.roles.cache.has(guildConfig.verifiedRoleId) &&
    newMember.roles.cache.has(guildConfig.verifiedRoleId)
  ) {

    joinTimes.delete(newMember.id);

    const username = newMember.displayName;

    try {
      await newMember.send(`**🎉 Congratulations ${username}!**
You are now VERIFIED and have full access to the server.
Please take a moment to familiarize yourself with the important channels below:

**📢 Announcement Channel  **
All important kingdom notices, war instructions, deadlines, and leadership announcements will be posted here.  
⚠️ This channel is mandatory to follow.  
https://discord.com/channels/1447945093410717790/1447962520026484736

**🗣️ Kingdom Chat**
For kingdom-wide discussions and important updates.  
https://discord.com/channels/1447945093410717790/1447945095037976731

**🎫 Ticket Channel  **
Use this channel to report issues, raise complaints, or contact staff.  
https://discord.com/channels/1447945093410717790/1448391461719642262

**🏰 Fort Status ** 
Check current status of how many forts you did.  
https://discord.com/channels/1447945093410717790/1448316740147744918

**💎 Resource Seller  **
For buying in-game resources.  
https://discord.com/channels/1447945093410717790/1448391436247498802

**🛒 Account Buying  **
Use this channel for account buying/selling discussions (follow rules strictly).  
https://discord.com/channels/1447945093410717790/1449084442319650826

**🧑‍✈️ Pilots  **
Find trusted pilots or offer piloting services as per kingdom rules.  
https://discord.com/channels/1447945093410717790/1449084662839513231

Please ensure you follow all alliance and kingdom rules while using these channels.

Welcome Again,
— Kingdom 3961 Leadership`);
    } catch {}
  }
});

async function fetchDisplayNames(guild, ids) {
  const names = [];
  for (const id of ids) {
    try {
      const member = await guild.members.fetch(id);
      names.push(member.displayName);
    } catch {
      names.push("Unknown");
    }
  }
  return names.join("\n");
}

client.login(BOT_TOKEN);
