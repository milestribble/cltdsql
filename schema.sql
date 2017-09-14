CREATE TABLE tasks (id serial PRIMARY KEY, title VARCHAR(20), status VARCHAR(10), due DATE);
CREATE TABLE tags (id serial PRIMARY KEY, title VARCHAR(20));
CREATE TABLE tasktags (task_id INT REFERENCES tasks(id), tag_id INT REFERENCES tags(id));
CREATE TABLE parent (parent_id INT REFERENCES tags(id), child_id INT REFERENCES tags(id));
