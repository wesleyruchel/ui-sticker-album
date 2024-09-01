import { useQuasar } from "quasar";

export default function useNotifications() {
  const $q = useQuasar();

  const showNotification = (
    message,
    type = "positive",
    timeout = 1500,
    position = "top"
  ) => {
    $q.notify({
      type: type,
      message: message,
      timeout: timeout,
      position: position,
    });
  };

  const showSuccessNotification = (
    message,
    timeout = 1500,
    position = "bottom"
  ) => {
    $q.notify({
      type: "positive",
      message: message,
      timeout: timeout,
      position: position,
    });
  };

  const showErrorNotification = (
    message,
    timeout = 1500,
    position = "bottom"
  ) => {
    $q.notify({
      type: "negative",
      message: message,
      timeout: timeout,
      position: position,
    });
  };

  return {
    showNotification,
    showSuccessNotification,
    showErrorNotification,
  };
}
