const router = require("express").Router();
const {
  getAllUser,
} = require("../../controllers/user-controller");

// /api/users
router.route("/").get(getAllUser);

module.exports = router;
