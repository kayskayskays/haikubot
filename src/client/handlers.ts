import { ChannelType, Events, Message } from "discord.js";
import { formatHaiku, parseHaiku } from "../util/util";
import { ClientWrapper } from "./ClientWrapper";

export const onLogin = (cw: ClientWrapper) => {
    const c = cw.client();
    c.once(Events.ClientReady, c => console.log(`Logged in as ${c.user.displayName}.`));
};

export const onMessage = (cw: ClientWrapper) => {
    const c = cw.client();

    c.on(Events.MessageCreate, async (msg: Message) => {
        if ( !msg.inGuild() ) {
            console.log("Not a guild...")
            return;
        }

        if ( msg.author.bot ) {
           return;
        }

        const channelId = cw.writeableChannelId();
        if ( !channelId ) {
            return;
        }

        const haiku = parseHaiku(msg.content);
        if ( !haiku ) {
            return;
        }

        const channel = await c.channels.fetch(channelId);

        await msg.react("🇭");
        await msg.react("🇦");
        await msg.react("🇮");
        await msg.react("🇰");
        await msg.react("🇺");

        // We are asserting that the (first) writeable channel for the bot is one in which other users may intentionally
        // be writing haikus. So, ignore messages from this channel.
        const msgChannelId = msg.channel.id;
        if ( msgChannelId === channelId ) {
           return;
        }

        const embedding = formatHaiku(msg.author.tag, msg.channel.name, haiku);

        if ( channel?.type === ChannelType.GuildText ) {
            channel.send({ embeds: [ embedding ] });
        }
    });
}

export const registerHandlers = (cw: ClientWrapper) => {
    onLogin(cw);
    onMessage(cw);
}