export const APIKeyHeaders = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  return {
    "Content-Type": "application/json",
    apiKey: API_KEY,
  };
};


