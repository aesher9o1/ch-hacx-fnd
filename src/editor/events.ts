export const ROOM = "aesher9o1";
export const EVENTS = {
  RECEIVE: "RECEIVE", //get updates from server
  SEND: "SEND", //send update to the server
  SYNC: "SYNC", //sync with server
  CHECKPOINT: "CHECKPOINT", //checkpoint data from server
};

export const getRandomUserColor = () => {
  const USER_COLORS = [
    "#30bced",
    "#6eeb83",
    "#ffbc42",
    "#ecd444",
    "#ee6352",
    "#9ac2c9",
    "#8acb88",
    "#1be7ff",
  ];

  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
};

export const isMobile = () => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
};
