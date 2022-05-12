import { OnBeforeRender } from '#types/on-before-render';

export const onBeforeRender: OnBeforeRender = async (ctx) => {
  console.log('context : ', ctx);
  return {
    pageContext: {},
  };
};
