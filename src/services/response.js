export const res200 = (data) => {
  return {
    data,
    error: "",
  };
}

export const res400 = (error) => {
  return {
    data: [],
    error,
  };
}