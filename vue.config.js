module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
            @import "@/scss/utilities/_variables.scss";
          `,
      },
    },
  },
};
