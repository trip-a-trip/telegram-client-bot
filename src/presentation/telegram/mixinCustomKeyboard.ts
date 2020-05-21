import merge from 'deepmerge';

export const mixinCustomKeyboard = (initial: object = {}) =>
  merge(initial, {
    reply_markup: {
      keyboard: [[{ text: 'Отправить геометку', request_location: true }]],
      resize_keyboard: true,
    },
  });
