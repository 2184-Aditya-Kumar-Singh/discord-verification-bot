const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: ["CHANNEL", "USER", "MESSAGE"]
});



// ===================== CONFIG =====================
const VERIFIED_ROLE_ID = process.env.VERIFIED_ROLE_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// Channel Links
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

// Leadership Info
const KING_IDS = [
  "537505308256370688",
  "826581562891960341"
];

// const COUNCIL_MEMBERS = [
//   "Myst",
//   "Mr Edd",
//   "Spartan",
//   "Radek",
//   "Leighton",
//   "Princess Nyu",
//   "Elmonton",
//   "Killer"
// ];
const COUNCIL_IDS = [
  "826581562891960341", // Myst
  "537505308256370688", // Mr Edd
  "1398965375781175418", // Spartan
  "888088767561347092", // Radek
  "151495610720190464", // Leighton
  "1342106477019791500", // Princess Nyu
  "939266674648027176", // Elmonton
  "1191418729410609222"  // Killer
];


const DEVELOPER_NAME = "Mr Edd (end.is.near_)";

// Store join times for reminder system
const joinTimes = new Map();
// ==================================================

// Ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ==================================================
// 1️⃣ WELCOME DM
// ==================================================
client.on("guildMemberAdd", async (member) => {
  const username = member.displayName;
  joinTimes.set(member.id, Date.now());
 
  try {
    await member.send(
`**📩 Welcome & Verification Guidelines**

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
— Kingdom 3961 Leadership`
    );
  } catch {
    console.log(`❌ Welcome DM failed for ${member.user.tag}`);
  }
});

// ==================================================
// 2️⃣ VERIFIED ROLE DM
// ==================================================
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const username = newMember.displayName;
  if (
    !oldMember.roles.cache.has(VERIFIED_ROLE_ID) &&
    newMember.roles.cache.has(VERIFIED_ROLE_ID)
  ) {
    joinTimes.delete(newMember.id);

    try {
      await newMember.send(
`**🎉 Congratulations ${username}!**
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
— Kingdom 3961 Leadership`
      );
    } catch {
      console.log(`❌ Verified DM failed for ${newMember.user.tag}`);
    }
  }
});

// ==================================================
// 3️⃣ UNVERIFIED REMINDER SYSTEM
// ==================================================
setInterval(async () => {
  const now = Date.now();

  for (const [userId, joinedAt] of joinTimes.entries()) {
    if (now - joinedAt >= 24 * 60 * 60 * 1000) {
      try {
        const user = await client.users.fetch(userId);
        await user.send(
`⏰ **Verification Reminder**

You are still not verified.

Please complete verification to avoid restrictions:
${LINKS.verify}`
        );
      } catch {}
    }
  }
}, 2 * 60 * 60 * 1000); // every 2 hours

// ==================================================
// 4️⃣ DM Q&A SYSTEM
// ==================================================
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

client.on("messageCreate", async (message) => {
  if (message.partial) {
    try {
      await message.fetch();
    } catch {
      return;
    }
  }

  if (message.author.bot) return;
  if (message.guild) return;

  const msg = message.content.toLowerCase();


  // Verification
  if (msg.includes("verify") || msg.includes("verification")) {
    return message.channel.send(
`✅ **How to Get Verified**
Send your in-game account screenshot here:
${LINKS.verify}`
    );
  }

  // Ticket / Leadership
  if (msg.includes("ticket") || msg.includes("leadership") || msg.includes("contact")) {
    return message.channel.send(
`🎫 **Contact Leadership or For anything**
Open a ticket here:
${LINKS.ticket}`
    );
  }

  // King
  if (msg.includes("king")) {
  const guild = client.guilds.cache.first();
  const kingNames = await fetchDisplayNames(guild, KING_IDS);

  return message.channel.send(
`👑 **Current Kings**
${kingNames}`
  );
}


  // Council
  if (msg.includes("council")) {
  const guild = client.guilds.cache.first();
  const councilNames = await fetchDisplayNames(guild, COUNCIL_IDS);

  return message.channel.send(
`🏛️ **Council Members**
${councilNames}`
  );
}


  // Fort
  if (msg.includes("fort")) {
    return message.channel.send(
`🏰 **Fort Status**
Check here:
${LINKS.fort}`
    );
  }

  // Announcements
  if (msg.includes("announce")) {
    return message.channel.send(
`📢 **Kingdom Announcements**
Announcements are done in 
${LINKS.announcement}`
    );
  }

  // Chat
  if (msg.includes("chat") || msg.includes("talk")) {
    return message.channel.send(
`🗣️ **Kingdom Chat**
This is our kingdom chat
${LINKS.kingdomChat}`
    );
  }

  // Resources
 if (
  msg.includes("resource") ||
  msg.includes("rss") ||
  msg.includes("buy resource") ||
  msg.includes("sell resource")
){
    return message.channel.send(
`💎 **Resources / RSS**
Send your resource requirment in
${LINKS.resource}`
    );
  }

  // Suggestions
  if (msg.includes("suggest")) {
    return message.channel.send(
`💡 **Suggestions**
Kindly send your suggestions here
${LINKS.suggestion}`
    );
  }

  // Developer
  if (msg.includes("developer") || msg.includes("bot")) {
    return message.channel.send(
`👨‍💻 **Bot Developer**
${DEVELOPER_NAME}`
    );
  }

  // Fallback
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
});

// Login
client.login(BOT_TOKEN);
