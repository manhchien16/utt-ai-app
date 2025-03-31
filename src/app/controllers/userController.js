const userService = require("../services/userService");

const userController = {
  getByToken: async (req, res) => {
    try {
      const accessToken = req.header("Authorization");
      if (!accessToken)
        res.status(401).json({ error: "Unauthorized: Missing token!" });
      const result = await userService.getByToken(accessToken);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await userService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const result = await userService.getAll(req?.params);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await userService.delete(id);
      res.status(200).json({ message: "delete success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await userService.update(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userController;
