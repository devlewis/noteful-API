BEGIN;

INSERT INTO notes 
    (title, content, folder_id)
    VALUES
    ('Heyo','Howdeedo', 1),
    ('Hiya','different', 2),
    ('Experimenting','it`s gotta be good', 2);

COMMIT;