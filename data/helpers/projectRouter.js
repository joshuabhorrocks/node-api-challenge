const express = require('express');
const router = express.Router();

const ProjectDB = require("./projectModel");
const ActionDB = require("./actionModel");

router.get('/', (req, res) => {
    ProjectDB.get()
      .then(projects => {
          res.status(200).json(projects)
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error retrieving the projects",
          });
      });
  });

router.get('/:id', validateProjectId, (req, res) => {
    ProjectDB.get(req.params.id)
      .then(project => {
          res.status(200).json(project)
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error retrieving the specific project",
          });
      });
  });

router.post('/', validateProject, (req, res) => {
    ProjectDB.insert(req.body)
    .then(project => {
        res.status(201).json(project)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "There was an error while saving the project to the database"});
    });
});

router.put("/:id", validateProjectId, validateProject, (req, res) => {
    const project_id = req.params.id;
    ProjectDB.update(project_id, req.body)
        .then(changed => {
            res.status(200).json(changed);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({message: "Error updating the project"});
        });
})

router.delete('/:id', validateProjectId, (req, res) => {
    const project_id = req.params.id;
      ProjectDB.remove(project_id)
      .then(deleted => {
        res.status(200).json(deleted)
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error removing the project",
          });
      });
  });

// Actions

router.get("/:id/actions", validateProjectId, (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: "Invalid project Id"})
    } else {
        ProjectDB.getProjectActions(req.params.id)
            .then(action => {
                res.status(200).json(action);
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({error: "There was an error while getting the project actions"})
            })
    }
})

router.post("/:id/actions", validateProjectId, validateAction, (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: "Invalid project Id"})
    } else {
        ActionDB.insert(req.body)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: "The id does not match a project"});
        });
    }
})

router.put("/:id/actions", validateProjectId, validateActionId, (req, res) => {
    const updates = req.body;
    if (!updates.description || !updates.notes || !updates.completed || !updates.project_id) {
        res.status(400).json({error: "Invalid info"})
    } else {
        ActionDB.update(req.params.id, updates)
        .then(updated => {
            if (updated) {
                res.status(200).json(updated)
            } else {
                res.status(400).json({error: "Not found"})
            }
        })
        .catch(error => {
            res.status(500).json(error.message )
        })
    }
})

router.delete("/:id/actions", validateProjectId, validateActionId, (req, res) => {
    const action_id = req.params.id;
      ActionDB.remove(action_id)
      .then(deleted => {
        res.status(200).json(deleted)
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error removing the action",
          });
      });
});

//custom middleware
function validateProjectId(req, res, next) {
    let project_id = req.params.id;
    if (!project_id) {
        res.status(400).json({message: "The project id was invalid"})
    } else if (project_id !== req.params.id) {
        res.status(400).json({message: "The project id doesn't match any projects"})
    }else {
        project_id = req.body
    }
    next();
}

function validateProject(req, res, next) {
    console.log(req.body);
    if (res.body === "") {
        res.status(400).json({message: "Missing project data"})
    } else if (req.body.name === "" && req.body.description === "") {
        res.status(400).json({message: "Missing name and body for project"})
    } else {
        next();
    }
}

function validateAction(req, res, next) {
    if (!req.body) {
        res.status(400).json({message: "Missing action data"})
    } else if (!req.params.id) {
        res.status(400).json({message: "Missing valid action id"})
    } else if (!req.body.description) {
        res.status(400).json({message: "Missing action description"})
    } else {
        next();
    }
}

function validateActionId(req, res, next) {
    let action_id = req.params.id;
    if (!action_id) {
        res. status(400).json({message: "The action id was invalid"})
    } else {
        action_id = req.body
    }
    next();
}

module.exports = router;