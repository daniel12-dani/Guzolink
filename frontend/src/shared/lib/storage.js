// const TOKEN_KEY = "guzolink-token";
// const USER_KEY = "guzolink-user";
const CART_KEY = "guzolink-cart";

function readJson(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  // ----- TOKEN ------------------------------------------------
  token: {
    get: () => localStorage.getItem("token"),
    set: (value) => localStorage.setItem("token", value),
    remove: () => localStorage.removeItem("token"),
  },

  // ----------user-------------
  user: {
   get: () => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    },
    set: (value) => {
      localStorage.setItem("user", JSON.stringify(value));
    },
    remove: () => {
      localStorage.removeItem("user");
    },
  },
  cart: {
    get: () => readJson(CART_KEY, []),
    set: (value) => writeJson(CART_KEY, value),
    remove: () => window.localStorage.removeItem(CART_KEY),
  },
  shops: {
    get: () => readJson("shops", []),
    set: (value) => writeJson("shops", value),
    remove: () => window.localStorage.removeItem("shops"),
  }
};
