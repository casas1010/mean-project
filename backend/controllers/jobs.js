const Job = require("../models/job");

exports.createJob = (req, res, next) => {
  console.log('create job api hit')
  const url = req.protocol + "://" + req.get("host");
  const post = new Job({
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
    state: 'new',
    substate: 'new'
  });
  post
    .save()
    .then(createdJob => {
      res.status(201).json({
        message: "Job added successfully",
        post: {
          ...createdJob,
          id: createdJob._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.updateJob = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Job({
    _id: req.body.id,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
    state: req.userData.state,
    substate:req.userData.substate,
  });
  Job.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getJobs = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Job.find();
  let fetchedJobs;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedJobs = documents;
      return Job.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Jobs fetched successfully!",
        posts: fetchedJobs,
        maxJobs: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getJob = (req, res, next) => {
  Job.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Job not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deleteJob = (req, res, next) => {
  Job.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};
