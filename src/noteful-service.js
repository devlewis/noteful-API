const NotefulService = {
  getAllNotes(knex) {
    return knex.select("*").from("notes");
  },
  getByNoteId(knex, id) {
    console.log("the note id in the service", id);
    return knex
      .from("notes")
      .select("*")
      .where("id", id)
      .first();
  },
  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into("notes")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteNote(knex, id) {
    return knex("notes")
      .where({ id })
      .delete();
  },
  updateNote(knex, id, newNoteContent) {
    return knex("notes")
      .where({ id })
      .update(newNoteContent);
  },

  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },
  getByFolderId(knex, id) {
    return knex
      .from("folders")
      .select("*")
      .where("id", id)
      .first();
  },
  insertFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into("folders")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteFolder(knex, id) {
    return knex("folders")
      .where({ id })
      .delete();
  },
  updateFolder(knex, id, newFolderContent) {
    return knex("folders")
      .where({ id })
      .update(newFolderContent);
  }
};

module.exports = NotefulService;
