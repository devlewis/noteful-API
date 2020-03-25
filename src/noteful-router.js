const path = require("path");
const express = require("express");
const xss = require("xss");
const logger = require("./logger");
const NotefulService = require("./noteful-service");
//const { getNoteValidationError } = require("./note-validator");

const notefulRouter = express.Router();
const bodyParser = express.json();

const serializeNote = note => ({
  id: note.id,
  name: xss(note.name),
  content: note.content,
  date_created: note.date_created,
  folderid: note.folderid
});

const serializeFolder = folder => ({
  id: folder.id,
  name: xss(folder.name)
});

notefulRouter
  .route("/notes")

  .get((req, res, next) => {
    NotefulService.getAllNotes(req.app.get("db"))
      .then(notes => {
        res.json(notes.map(serializeNote));
      })
      .catch(next);
  })

  .post(bodyParser, (req, res, next) => {
    const { name, content, folderid } = req.body;
    const newNote = { name, content, folderid };

    for (const field of ["name", "content", "folderid"]) {
      if (!newNote[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }
    //const error = getNoteValidationError(newNote);
    //if (error) return res.status(400).send(error);

    NotefulService.insertNote(req.app.get("db"), newNote)
      .then(note => {
        logger.info(`note with id ${note.id} created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  });

notefulRouter
  .route("/folders")

  .get((req, res, next) => {
    NotefulService.getAllFolders(req.app.get("db"))
      .then(folders => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })

  .post(bodyParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = { name };

    if (!newFolder["name"]) {
      logger.error(`name is required`);
      return res.status(400).send({
        error: { message: `name is required` }
      });
    }

    //const error = getNoteValidationError(newNote);
    //if (error) return res.status(400).send(error);

    NotefulService.insertFolder(req.app.get("db"), newFolder)
      .then(folder => {
        logger.info(`folder with id ${folder.id} created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${folder.id}`))
          .json(serializeFolder(folder));
      })
      .catch(next);
  });

notefulRouter
  .route("/notes/:noteId")

  .all((req, res, next) => {
    const { noteId } = req.params;
    console.log(noteId, typeof noteId, parseInt(noteId));
    NotefulService.getByNoteId(req.app.get("db"), parseInt(noteId))
      .then(note => {
        console.log(note);
        if (!note) {
          logger.error(`Note with id ${noteId} not found.`);
          return res.status(404).json({
            error: { message: `Note Not Found` }
          });
        }

        res.note = note;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializeNote(res.note));
  })

  .delete((req, res, next) => {
    const { noteId } = req.params;
    console.log(noteId, typeof noteId);
    NotefulService.deleteNote(req.app.get("db"), parseInt(noteId))
      .then(numRowsAffected => {
        logger.info(`Note with id ${noteId} deleted.`);
        res.status(200).json({ success: true });
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { name, content, folderid } = req.body;
    const noteToUpdate = { name, content, folderid };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'name', 'content', or 'folderid'`
        }
      });
    }

    //const error = getNoteValidationError(noteToUpdate);

    // if (error) return res.status(400).send(error);

    NotefulService.updateNote(
      req.app.get("db"),
      req.params.noteId,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

notefulRouter
  .route("/folders/:folderid")

  .all((req, res, next) => {
    const { folderid } = req.params;
    NotefulService.getByFolderId(req.app.get("db"), folderid)
      .then(folder => {
        if (!folder) {
          logger.error(`folder with id ${folderid} not found.`);
          return res.status(404).json({
            error: { message: `folder Not Found` }
          });
        }

        res.folder = folder;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializeFolder(res.folder));
  })

  .patch(bodyParser, (req, res, next) => {
    const { name } = req.body;
    const folderToUpdate = { name };

    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content 'name'`
        }
      });
    }

    //const error = getfolderValidationError(foldertoUpdate);

    // if (error) return res.status(400).send(error);

    NotefulService.updateFolder(
      req.app.get("db"),
      req.params.folderid,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notefulRouter;
