const jwt = require("jsonwebtoken");
const Journalist = require("../modules/journalist");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "nodeAPI");
    const journalist = await Journalist.findById({ _id: decode._id });

    req.journalist = journalist;
    next();
  } catch (e) {
    res.send({ error: "Authenticate Please...." });
  }
};

module.exports = auth;
