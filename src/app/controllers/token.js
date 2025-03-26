const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      res.status(403).json({ message: "Refresh token not provided" });
    const accessToken = await refreshToken();
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { refreshToken };
