const Journalist = require("../modules/journalist");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");

// CRUD

router.post("/signup", async (req, res) => {
  try {
    const journalist = new Journalist(req.body);
    await journalist.save();
    const token = journalist.generateToken();
    res.send({ journalist, token });
  } catch (e) {
    res.send(e.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const journalist = await Journalist.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = journalist.generateToken();
    res.send({ journalist, token });
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/profile", auth, (req, res) => {
  res.send(req.journalist);
});

router.delete("/profile", auth, async (req, res) => {
  try {
    await req.journalist.remove();
    res.send(req.journalist);
  } catch (e) {
    res.send({ error: "Not Found" });
  }
});

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      return cb(new Error("Please uplaod image"), null);
    }
    cb(null, true);
  },
});
router.post(
  "/profileImage",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      req.journalist.image = req.file.buffer;
      await req.journalist.save();
      res.send();
    } catch (e) {
      res.send(e.message);
    }
  }
);

router.patch("/journalist", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    if (!req.journalist) {
      return res.send("No user is found");
    }
    updates.forEach((el) => (req.journalist[el] = req.body[el]));
    await req.journalist.save();
    res.send(req.journalist);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;
