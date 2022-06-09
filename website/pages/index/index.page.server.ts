import { OnBeforeRender } from '#types/on-before-render';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (ctx) => {
  console.log("I'm from home page.");
  return {
    pageContext: {},
  };
};
