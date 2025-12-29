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
  } catch (error) {
    console.log(`❌ Welcome DM failed for ${member.user.tag}`);
  }
});

// 🔹 2️⃣ DM when user gets the Verified role
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  // Check if Verified role was just added
  const username = member.user.username;
  if (
    !oldMember.roles.cache.has(VERIFIED_ROLE_ID) &&
    newMember.roles.cache.has(VERIFIED_ROLE_ID)
  ) {
    try {
      await newMember.send(
`🎉 Congratulations ${username}!
You are now VERIFIED and have full access to the server.
Please take a moment to familiarize yourself with the important channels below:

🗣️ Kingdom Chat  
For kingdom-wide discussions and important updates.  
https://discord.com/channels/1447945093410717790/1447945095037976731

🎫 Ticket Channel  
Use this channel to report issues, raise complaints, or contact staff.  
https://discord.com/channels/1447945093410717790/1448391461719642262

🏰 Fort Status  
Check current status of how many forts you did.  
https://discord.com/channels/1447945093410717790/1448316740147744918

💎 Resource Seller  
For buying in-game resources.  
https://discord.com/channels/1447945093410717790/1448391436247498802

🛒 Account Buying  
Use this channel for account buying/selling discussions (follow rules strictly).  
https://discord.com/channels/1447945093410717790/1449084442319650826

🧑‍✈️ Pilots  
Find trusted pilots or offer piloting services as per kingdom rules.  
https://discord.com/channels/1447945093410717790/1449084662839513231

Please ensure you follow all alliance and kingdom rules while using these channels.

Welcome officially, and fight with honor 👑  
— Kingdom 3961 Leadership`
      );
    } catch (error) {
      console.log(`❌ Verified DM failed for ${newMember.user.tag}`);
    }
  }
});

// Login the bot
client.login(BOT_TOKEN);
