import { Client, Events, Message } from "discord.js";
import { findWriteableChannel, formatHaiku, parseHaiku } from "./util.js";

export const onLogin = (c: Client) => {
    c.once(Events.ClientReady, c => console.log(`Logged in as ${c.user.displayName}.`));
};

export const onMessage = (c: Client) => {
    c.on(Events.MessageCreate, async (msg: Message) => {
        if ( !msg.inGuild() ) {
            console.log("Not a guild...")
            return;
        }

        if ( msg.author.bot ) {
           return;
        }

        const haiku = parseHaiku(msg.content);
        if ( !haiku ) {
           console.log("Not a haiku...")
           return;
        }

        const guild = msg.guild;
        if ( !guild ) {
           console.log("No guild...")
           return;
        }

        const channel = findWriteableChannel(guild);
        if ( !channel ) {
           console.log("No writeable channel...")
           return;
        }

        await msg.react("🇭");
        await msg.react("🇦");
        await msg.react("🇮");
        await msg.react("🇰");
        await msg.react("🇺");

        // We are asserting that the (first) writeable channel for the bot is one in which other users may intentionally
        // be writing haikus. So, ignore messages from this channel.
        const msgChannelName = msg.channel.name;
        if ( channel.name === msgChannelName ) {
           console.log("Ignoring...")
           return;
        }

        const embedding = formatHaiku(msg.author.tag, msgChannelName, haiku);

        channel.send({ embeds: [ embedding ] });
    });
}

export const registerHandlers = (c: Client) => {
    onLogin(c);
    onMessage(c);
}