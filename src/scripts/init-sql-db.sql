CREATE TABLE Person (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL UNIQUE,
    role varchar(255) NOT NULL
);

CREATE TABLE Course (
    id serial PRIMARY KEY,
    teacher_id int NOT NULL,
    student_class varchar(30),
    title varchar(200) NOT NULL,
    content text NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES Person(id)
)

CREATE TABLE Class (
    name varchar(30) PRIMARY KEY
)

ALTER TABLE Course
ADD CONSTRAINT 'fk_group_name'
FOREIGN KEY ('student_class')
REFERENCES 'Class' ('name');