import { ChannelType, Events, Message } from "discord.js";
import { formatHaiku, parseHaiku } from "../util/util.js";
import { ClientWrapper } from "./ClientWrapper.js";

export const onLogin = (cw: ClientWrapper) => {
    const c = cw.client();
    c.once(Events.ClientReady, c => console.log(`Logged in as ${c.user.displayName}.`));
};

export const onMessage = (cw: ClientWrapper) => {
    const c = cw.client();

    c.on(Events.MessageCreate, async (msg: Message) => {
        if ( !msg.inGuild() ) {
            return;
        }

        if ( msg.author.bot ) {
           return;
        }

        const channelId = cw.writeableChannelId();
        console.log(channelId);
        if ( !channelId ) {
            return;
        }

        const guildId = msg.guildId;

        const haiku = parseHaiku(cw.kvStore(guildId), msg.content);
        if ( !haiku ) {
            return;
        }

        const channel = await c.channels.fetch(channelId);

        await msg.react("🇭");
        await msg.react("🇦");
        await msg.react("🇮");
        await msg.react("🇰");
        await msg.react("🇺");

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