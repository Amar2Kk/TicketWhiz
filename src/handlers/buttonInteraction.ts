import { ButtonInteraction, CacheType, Client } from "discord.js";

export const handleButtonInteraction = async (
  client: Client,
  interaction: ButtonInteraction<CacheType>
) => {
  console.log('button interaction received');
  console.log(interaction.customId);
  console.log(interaction.message.id);

  switch (interaction.customId) {
    case 'createTicket':{
    
    }
  }
};
