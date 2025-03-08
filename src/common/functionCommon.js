const areObjectValid = (keys, queryParams) => {
  return keys.every((key) => {
    const value = queryParams?.[key];
    return typeof value === "string" && value.trim().length > 0;
  });
};

module.exports = { areObjectValid };
