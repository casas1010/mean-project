const express = require("express");

const JobController = require("../controllers/jobs");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

console.log('jobs router hit');

router.post("", checkAuth, extractFile, JobController.createJob);

router.put("/:id", checkAuth, extractFile, JobController.updateJob);

router.get("", JobController.getJobs);

router.get("/:id", JobController.getJob);

router.delete("/:id", checkAuth, JobController.deleteJob);

module.exports = router;
