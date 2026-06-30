const { REST, Routes, SlashCommandBuilder } = require("discord.js");

async function registerCommands(clientId, token) {

    const commands = [

        new SlashCommandBuilder()
            .setName("setup")
            .setDescription("Setup the verification system")
            .addRoleOption(option =>
                option
                    .setName("guest_role")
                    .setDescription("Guest role")
                    .setRequired(true)
            )
            .addRoleOption(option =>
                option
                    .setName("verified_role")
                    .setDescription("Verified Member role")
                    .setRequired(true)
            )
            .addChannelOption(option =>
                option
                    .setName("verification_channel")
                    .setDescription("Verification Channel")
                    .setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName("welcome")
            .setDescription("Setup welcome channel")
            .addChannelOption(option =>
                option
                    .setName("welcome_channel")
                    .setDescription("Welcome Channel")
                    .setRequired(true)
            )

    ].map(command => command.toJSON());

    const rest = new REST({ version: "10" }).setToken(token);

    await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
    );

    console.log("✅ Slash commands registered.");
}

module.exports = { registerCommands };
