import vue3GoogleLogin from "vue3-google-login";

export const install = (app: any) => {
  app.use(vue3GoogleLogin, {
    clientId: "280175162994-tl6kqfk5l9hl3bmq1ejkkpah8ja1korf.apps.googleusercontent.com",
    clientSecret: "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",
  });
};
