const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

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
    .setDescription("Contact leadership / open ticket"),

  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup verification system for this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option =>
      option.setName("verified_role")
        .setDescription("Role to give after verification")
        .setRequired(true))
    .addChannelOption(option =>
      option.setName("verify_channel")
        .setDescription("Channel where users send screenshots")
        .setRequired(true))
    .addChannelOption(option =>
      option.setName("log_channel")
        .setDescription("Channel where verification logs are sent")
        .setRequired(true))

].map(cmd => cmd.toJSON());

async function registerCommands(clientId, token) {
  const rest = new REST({ version: "10" }).setToken(token);

  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands }
  );

  console.log("✅ Global slash commands registered");
}

module.exports = { registerCommands };
