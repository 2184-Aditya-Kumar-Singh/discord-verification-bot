const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help and list of commands"),

  new SlashCommandBuilder()
    .setName("verify")
    .setDescription("How to get verified"),

  new SlashCommandBuilder()
    .setName("fort")
    .setDescription("Check fort status"),

  new SlashCommandBuilder()
    .setName("king")
    .setDescription("View current kings"),

  new SlashCommandBuilder()
    .setName("council")
    .setDescription("View council members"),

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Contact leadership / open ticket")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

async function registerCommands(clientId, guildId) {
  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
  );
  console.log("✅ Slash commands registered");
}

module.exports = { registerCommands };
