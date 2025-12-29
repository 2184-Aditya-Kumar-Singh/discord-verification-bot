const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const VERIFIED_ROLE_ID = process.env.VERIFIED_ROLE_ID;

client.on("guildMemberAdd", member => {
  member.send(
`Welcome to the server!

Please read the rules and complete verification.
Rules: [Link]
Verify here: [Link]`
  ).catch(() => {});
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  if (!oldMember.roles.cache.has(VERIFIED_ROLE_ID) &&
      newMember.roles.cache.has(VERIFIED_ROLE_ID)) {

    newMember.send(
`You are now VERIFIED ✅

You now have full access to the server.
Please follow leadership instructions.`
    ).catch(() => {});
  }
});

client.login(process.env.BOT_TOKEN);
