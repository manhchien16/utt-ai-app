const { pagination } = require("../../common/functionCommon");
const { verifyToken } = require("../middleware/jwtMiddleware");
const userCollection = require("../models/user");

const userService = {
  getAll: async (params) => {
    try {
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const skip = (page - 1) * pageSize;
      const result = await userCollection.find().skip(skip).limit(pageSize);
      const totalProduct = await userCollection.countDocuments();
      return {
        data: result,
        pagination: pagination(page, pageSize, totalProduct),
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },

  getByToken: async (accessToken) => {
    try {
      const [bearer, token] = accessToken.split(" ");
      if (bearer !== "Bearer" || !token) {
        throw new Error({ message: "Unauthorized: Invalid token format" });
      }

      const decoded = verifyToken(token, "access");

      if (!decoded?._id) throw new Error("Invalid token");

      return await userCollection.findById(decoded._id).lean();
    } catch (error) {
      throw new Error(`Error getting user by token: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      if (!id) throw new Error("Data is invalid");
      return await userCollection.findById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  delete: async (id) => {
    try {
      if (!id) throw new Error("Data is invalid");
      await userCollection.findByIdAndDelete(id);
      return "delete successfully";
    } catch (error) {
      throw new Error(error.message);
    }
  },

  update: async (_id, data) => {
    try {
      if (!_id || !data)
        throw new Error("Invalid data: _id and role are required");

      return await userCollection
        .findByIdAndUpdate(_id, data, { new: true, runValidators: true })
        .lean();
    } catch (error) {
      throw new Error(`Error updating role: ${error.message}`);
    }
  },
};

module.exports = userService;
