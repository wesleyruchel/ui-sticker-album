export function formatSuccess(response) {
  return {
    data: response.data,
    message: response.data.message || "Sucesso.",
    status: response.status,
  };
}

export function formatError(error) {
  if (error.response) {
    return {
      message:
        error.response.data.message || "Um erro ocorreu durante a requisção.",
      status: error.response.status,
      details: error.response.data.errors || null,
    };
  } else if (error.request) {
    return {
      message: "O servidor não respondeu. Tente novamente mais tarde.",
      status: null,
    };
  } else {
    return {
      message: error.message || "Um erro inesperado ocorreu.",
      status: null,
    };
  }
}
