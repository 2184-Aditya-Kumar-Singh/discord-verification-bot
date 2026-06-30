const {
    Client,
    GatewayIntentBits,
    Partials,
    PermissionsBitField,

    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,

    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,

    Events
} = require("discord.js");

const fs = require("fs-extra");
const path = require("path");
const { registerCommands } = require("./commands");

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent

    ],

    partials: [
        Partials.Channel
    ]

});

const TOKEN = process.env.BOT_TOKEN;

const CONFIG = path.join(__dirname, "config.json");

let config = {};

if (fs.existsSync(CONFIG)) {
    config = fs.readJsonSync(CONFIG);
}
client.once("ready", async () => {

    console.log(`Logged in as ${client.user.tag}`);

    await registerCommands(
        client.user.id,
        TOKEN
    );

});
function saveConfig() {

    fs.writeJsonSync(
        CONFIG,
        config,
        {
            spaces:2
        }
    );

}

// ================= SETUP COMMAND =================

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName !== "setup") return;

    if (
        !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
        )
    ) {
        return interaction.reply({
            content: "Only admins can use this command.",
            ephemeral: true
        });
    }

    const guestRole = interaction.options.getRole("guest_role");
    const verifiedRole = interaction.options.getRole("verified_role");
    const verificationChannel = interaction.options.getChannel("verification_channel");

    config[interaction.guild.id] = {

        guestRole: guestRole.id,
        verifiedRole: verifiedRole.id,
        verificationChannel: verificationChannel.id,

        welcomeChannel:
            config[interaction.guild.id]?.welcomeChannel || null,

        welcomeMessage:
            config[interaction.guild.id]?.welcomeMessage || null

    };

    saveConfig();

    const row = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId("verify")
            .setLabel("✅ Verify Me")
            .setStyle(ButtonStyle.Success)

    );

    await verificationChannel.send({

        embeds: [

            {

                color: 0x2ecc71,

                title: "Verification",

                description:
"Thank you for joining our community!\n\n" +
"To unlock full access to the server, simply click the **✅ Verify Me** button below.\n\n" +
"Once verified, you'll be able to:\n" +
"• 🔓 Access all server channels\n" +
"• 💬 Participate in community discussions\n" +
"• 📢 Receive important announcements\n" +
"• 🎉 Enjoy all member-exclusive features\n\n" +
"If you encounter any issues during verification, please contact a member of our staff.\n\n" +
"**Click the button below to get started!** 🚀"
            }

        ],

        components: [row]

    });

    interaction.reply({

        content: "✅ Setup completed successfully.",

        ephemeral: true

    });

});
client.on(Events.InteractionCreate,async interaction=>{

    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName!=="welcome") return;

    if(
        !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
        )
    ){

        return interaction.reply({

            content:"Only admins can use this.",

            ephemeral:true

        });

    }

    const channel=
    interaction.options.getChannel("welcome_channel");

    if(!config[interaction.guild.id])
        config[interaction.guild.id]={};

    config[interaction.guild.id].welcomeChannel=channel.id;

    saveConfig();

    const modal=new ModalBuilder()

    .setCustomId("welcome_modal")

    .setTitle("Welcome Message");

    const input=new TextInputBuilder()

    .setCustomId("welcome_message")

    .setLabel("Type your custom welcome message")

    .setStyle(TextInputStyle.Paragraph)

    .setRequired(true);

    modal.addComponents(

        new ActionRowBuilder()

        .addComponents(input)

    );

    await interaction.showModal(modal);

});

client.on(Events.InteractionCreate,async interaction=>{

    if(!interaction.isModalSubmit()) return;

    if(interaction.customId!=="welcome_modal")
        return;

    const msg=

    interaction.fields.getTextInputValue(
        "welcome_message"
    );

    config[interaction.guild.id].welcomeMessage=msg;

    saveConfig();

    interaction.reply({

        content:"Welcome message saved successfully.",

        ephemeral:true

    });

});

// ================= BUTTON VERIFY =================

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isButton()) return;

    if (interaction.customId !== "verify") return;

    const guildConfig = config[interaction.guild.id];

    if (!guildConfig) {
        return interaction.reply({
            content: "Server is not setup yet.",
            ephemeral: true
        });
    }

    const member = interaction.member;

    try {

        const verifiedRole = interaction.guild.roles.cache.get(guildConfig.verifiedRole);

        const guestRole = interaction.guild.roles.cache.get(guildConfig.guestRole);

        if (!verifiedRole) {

            return interaction.reply({

                content: "Verified role not found.",

                ephemeral: true

            });

        }

        if (member.roles.cache.has(verifiedRole.id)) {

            return interaction.reply({

                content: "You are already verified.",

                ephemeral: true

            });

        }

        await member.roles.add(verifiedRole);

        if (guestRole) {

            await member.roles.remove(guestRole).catch(() => {});

        }

        await interaction.reply({

            content:
                "🎉 You have been verified successfully!\n\nYou now have full access to the server.\nEnjoy!",

            ephemeral: true

        });

    } catch (err) {

        console.log(err);

        interaction.reply({

            content: "Something went wrong.",

            ephemeral: true

        });

    }

});

// ================= MEMBER JOIN =================

client.on(Events.GuildMemberAdd, async member => {

    const guildConfig = config[member.guild.id];

    if (!guildConfig) return;

    try {

        const guestRole = member.guild.roles.cache.get(guildConfig.guestRole);

        if (guestRole) {

            await member.roles.add(guestRole);

        }

        const welcomeChannel = member.guild.channels.cache.get(
            guildConfig.welcomeChannel
        );

        if (welcomeChannel) {

            let message =
                guildConfig.welcomeMessage ||
                "Welcome {user}!";

            message = message
                .replace("{user}", `<@${member.id}>`)
                .replace("{username}", member.user.username)
                .replace("{server}", member.guild.name);

            await welcomeChannel.send(message);

        }

    } catch (err) {

        console.log(err);

    }

});
client.login(TOKEN);
