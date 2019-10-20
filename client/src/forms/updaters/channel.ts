import { MutationUpdaterFn } from 'apollo-client';
import { CHANNELS } from '../../graphql/queries';

export const updateCacheAfterCreate: MutationUpdaterFn = (cache, result) => {
  const { channels } = cache.readQuery({ query: CHANNELS }) as { channels: any[] };

  cache.writeQuery({
    query: CHANNELS,
    data: { channels: [...channels, (result.data as any).createChannel] },
  });
};

export const updateCacheAfterUpdate: MutationUpdaterFn = (cache, result) => {
  try {
    const data = (result.data as any).updateChannel as { id: number };
    const { channels } = cache.readQuery({ query: CHANNELS }) as { channels: any[] };

    cache.writeQuery({
      query: CHANNELS,
      data: {
        channels: channels.map(channel => {
          if (channel.id !== data.id) return channel;

          return data;
        }),
      },
    });
  } catch (err) {
    // cannot update cache since CHANNELS hasn't yet been loaded
    // not sure why this throws?
    // ref: https://github.com/apollographql/apollo-client/issues/1701
  }
};

export const updateCacheAfterDelete: MutationUpdaterFn = (cache, result) => {
  try {
    const data = (result.data as any).deleteChannel as { ok: boolean; model: { id: number } };
    if (!data.ok) return;

    const { channels } = cache.readQuery({ query: CHANNELS }) as { channels: any[] };

    cache.writeQuery({
      query: CHANNELS,
      data: {
        channels: channels.filter(channel => channel.id !== data.model.id),
      },
    });
  } catch (err) {
    // cannot update cache since CHANNELS hasn't yet been loaded
    // not sure why this throws?
    // ref: https://github.com/apollographql/apollo-client/issues/1701
  }
};
