'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Folder = require('../models/folder');

const Note = require('../models/note');

/* ========== GET/READ ALL FOLDERS ========== */
router.get('/folders', (req, res, next) => {
  Folder.find()
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE FOLDER ========== */
router.get('/folders/:id', (req, res, next) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Folder.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
/* ========== POST/CREATE AN FOLDER ========== */
router.post('/folders', (req, res, next) => {
  const { name } = req.body;
  
  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request folder');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { name };
  
  Folder.create(newItem)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE FOLDER ========== */
router.put('/folders/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  
  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request folder');
    err.status = 400;
    return next(err);
  }
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  const updateItem = { name };
  const options = { new: true };
  
  Folder.findByIdAndUpdate(id, updateItem, options)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE FOLDER ========== */
router.delete('/folders/:id', (req, res, next) => {
  const { id } = req.params;
 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findByIdAndRemove(id)
    .then(() => {
      Note.deleteMany({folderId:id})
        .then(() => {
          res.status(204).end();
        });
    })
    .catch(err => {
      next(err);
    });
});
  

module.exports = router;
