DROP TABLE tags;
DROP TABLE tasktags;
DROP TABLE tasks;

CREATE TABLE tasks (
  self serial PRIMARY KEY,
  entry VARCHAR(20),
  status VARCHAR(10),
  due DATE,
  above INT,
  inside INT
);
CREATE TABLE tags (
  self serial PRIMARY KEY,
  title VARCHAR(20)
);
CREATE TABLE tasktags (
  self INT REFERENCES tasks(self),
  tag INT REFERENCES tags(self)
);
