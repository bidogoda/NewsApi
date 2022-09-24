const express = require("express");
const router = express.Router();
const Np = require("../modules/np");
const auth = require("../middleware/auth");
const multer = require("multer");
const timestamp = require("time-stamp");

router.post("/np", auth, async (req, res) => {
  try {
    const np = new Np({
      ...req.body,
      createdAt: timestamp(),
      publisher: req.journalist._id,
    });

    await np.save();
    res.send(np);
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/np/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const np = await Np.findOne({ _id: id, publisher: req.journalist._id });
    if (!np) {
      return res.send("No newspaper is found");
    }
    res.send(np);
  } catch (e) {
    res.send(e.message);
  }
});

router.patch("/np/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const np = await Np.findOneAndUpdate(
      { _id, publisher: req.journalist._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!np) {
      return res.send("No newspaper is found");
    }
    res.send(np);
  } catch (e) {
    res.send(e.message);
  }
});

router.delete("/np/:id", auth, async (req, res) => {
  try {
    const idNp = req.params.id;
    const np = await Np.findOneAndDelete({
      _id: idNp,
      publisher: req.journalist._id,
    });
    if (!np) {
      return res.send("No newspaper is found to delete");
    }
    res.send(np);
  } catch (e) {
    res.send(e.message);
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
  "/npImage/:id",
  auth,
  upload.single("npImage"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const np = await Np.findOne({ _id: id, publisher: req.journalist._id });
      if (!np) {
        return res.send("No newspaper is found");
      }
      np.image = req.file.buffer;
      await np.save();
      res.send();
    } catch (e) {
      res.send(e.message);
    }
  }
);

module.exports = router;
