// Importing required modules and entities
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  Client,
  GuildTextBasedChannel,
} from "discord.js";
import { AppDataSource } from "../typeorm";
import { ticketConfig } from "../typeorm/entities/ticketSchema";

// Accessing the repository from the database
const ticketConfigRepo = AppDataSource.getRepository(ticketConfig);

// Handling the chat input command interaction
export const handleChatInputCommand = async (
  client: Client,
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  switch (interaction.commandName) {
    case "setup": {
      // Getting the guild ID and channel from the interaction options
      const guildId = interaction.guildId || "";
      const channel = interaction.options.getChannel(
        "channel"
      ) as GuildTextBasedChannel;

      // Finding the existing ticket configuration in the database
      const ticketConfig = await ticketConfigRepo.findOneBy({ guildId });

      // Setting the message options
      const messageOptions = {
        content: "Interact with the button to either Create or Manage a Ticket",
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId("createTicket")
              .setEmoji("🎫")
              .setLabel("Create a Ticket")
              .setStyle(ButtonStyle.Primary)
          ),
        ],
      };

      try {
        if (!ticketConfig) {
          // If no ticket configuration exists in the database, create a new one
          const msg = await channel.send(messageOptions);
          const newTicketConfig = ticketConfigRepo.create({
            guildId,
            messageId: msg.id,
            channelId: channel.id,
          });
          await ticketConfigRepo.save(newTicketConfig);
          console.log("saved to DB");

          // Sending a reply to the interaction
          await interaction.reply({
            content: `TicketWhiz Initialized! Message sent in ${channel}.`,
            ephemeral: true,
          });
        } else {
          // If a ticket configuration already exists, update it with the new channel and message ID
          const msg = await channel.send(messageOptions);
          ticketConfig.channelId = channel.id;
          ticketConfig.messageId = msg.id;
          await ticketConfigRepo.save(ticketConfig);

          // Sending a reply to the interaction
          await interaction.reply({
            content: `New message sent in ${channel}.`,
            ephemeral: true,
          });
        }
      } catch (error) {
        // Handling errors
        console.log(error);
        await interaction.reply({
          content: `Something went wrong D:`,
          ephemeral: true,
        });
      }
    }
  }
};
