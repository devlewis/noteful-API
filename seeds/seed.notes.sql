BEGIN;

INSERT INTO notes 
    (title, content, folderId)
    VALUES
    ('Heyo','Howdeedo', 1),
    ('Hiya','different', 2),
    ('Experimenting','it`s gotta be good', 2);

COMMIT;