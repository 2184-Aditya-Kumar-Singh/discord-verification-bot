const { Client, GatewayIntentBits } = require("discord.js");

// Create Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
});

// Environment variables
const VERIFIED_ROLE_ID = process.env.VERIFIED_ROLE_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// Bot ready event
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// 🔹 1️⃣ Welcome DM when user joins the server
client.on("guildMemberAdd", async (member) => {
  const username = member.user.username;
  try {
    await member.send(
`**📩 Welcome & Verification Guidelines**

Hello **${username}**, Welcome to Kingdom 3961 Server 👋

To ensure smooth coordination and discipline, please follow the steps below:

**📜 Step 1: Read the Rules**
Before participating, you must read and understand our rules.
➡️ Rules Channel: https://discord.com/channels/1120417419358392370/1120417419823939676
Failure to follow the rules may lead to warnings or removal.

**✅ Step 2: Verification Required**
To get full access to the server, you need to verify yourself.
➡️ Verification Channel: 
📸 Please send a screenshot/image of your in-game account as instructed.
Once verified, you will receive the Verified role and unlock all alliance channels.

**⚠️ Important Notes**
• Do not DM staff unless instructed
• Follow leadership directions at all times
• Leaks, spying, or rule violations are strictly punished

If you have questions, wait until verification is complete.
— Kingdom 3961 Leadership`
    );
  } catch (error) {
    console.log(`❌ Welcome DM failed for ${member.user.tag}`);
  }
});

// 🔹 2️⃣ DM when user gets the Verified role
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  // Check if Verified role was just added
  if (
    !oldMember.roles.cache.has(VERIFIED_ROLE_ID) &&
    newMember.roles.cache.has(VERIFIED_ROLE_ID)
  ) {
    try {
      await newMember.send(
`✅ You are now VERIFIED!

You now have full access to the server.
Please follow alliance rules and leadership instructions at all times.

Welcome officially 👑`
      );
    } catch (error) {
      console.log(`❌ Verified DM failed for ${newMember.user.tag}`);
    }
  }
});

// Login the bot
client.login(BOT_TOKEN);
