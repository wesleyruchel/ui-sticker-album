import { Loading, QSpinnerHourglass } from "quasar";

export const HandlerLoading = {
  show(message) {
    Loading.show({
      spinner: QSpinnerHourglass,
      message: message,
      backgroundColor: "white",
      messageColor: "primary",
      spinnerColor: "primary",
    });
  },

  hide() {
    Loading.hide();
  },
};
