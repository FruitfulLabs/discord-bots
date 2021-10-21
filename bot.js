import { Client, Intents } from "discord.js";
import { config } from "dotenv";
import { Contract, providers, utils } from "ethers";

config();

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

const channelID_lb_general = "837830698214883362";

bot.once("ready", () => {
  console.log("xolove AI is ready ~");
});

bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "when_season_001") {
    await interaction.reply("Soooooon");
  } else if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  } else if (commandName === "user") {
    await interaction.reply(
      `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
    );
  }
});

bot.login(process.env.DISCORD_BOT_TOKEN);

const DLC_ADDR = "0x69bdE563680f580A2da5b5d4E202ecA4FDF35664";
const XOLOVE_ADDR = "0x38a09EF7300becc2dE6824423C8AB5C9b93e418c";
const ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

const provider = new providers.JsonRpcProvider("https://polygon-rpc.com");

const dlcSC = new Contract(DLC_ADDR, ABI, provider);

dlcSC.on("Transfer", async (from, to, value) => {
  if (to == XOLOVE_ADDR) {
    const rawMsg = `
    How lovely!
    Dividends have just been distributed to xoLove Token holders!
    
    Amount: ${utils.formatUnits(value, 18)} Love Tokens
    From address: ${from}
    `;

    console.log(`
    ~~~~~~~~~~~~~~~~~
    Dividends have just been distributed to xoLove Token holders!
    ~~~~~~~~~~~~~~~~~
    amount: ${value} Love Tokens
    from address: ${from}
    `);

    return bot.channels.cache.get(channelID_lb_general).send(rawMsg);
  }

  // console.log("a Love token transfer has been made");
});

// Reply to user messages
// bot.on("messageCreate", async (message) => {
//   // Do not reply if message was sent by bot
//   //   if (message.author.bot) return;

// });
