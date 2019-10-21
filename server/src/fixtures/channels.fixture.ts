import Channel from '../models/channel.model';

export const model = Channel;
export const data = [
  {
    id: 1,
    name: 'Google',
    layout: 'single',
    duration: -1,
    urls: [['https://google.com']],
  },
  {
    id: 2,
    name: 'Google Split',
    layout: '1-1-vertical',
    duration: 60000,
    urls: [['https://google.com', 'https://google.com']],
  },
];
