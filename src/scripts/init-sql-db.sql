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
    id serial PRIMARY KEY,
    name varchar(30) NOT NULL UNIQUE
)

CREATE TABLE ClassMembership (
    person_id int NOT NULL,
    class_name varchar(30) NOT NULL,
    PRIMARY KEY (person_id, class_name),
    FOREIGN KEY (person_id) REFERENCES Person(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (class_name) REFERENCES Class(name) ON DELETE CASCADE ON UPDATE CASCADE
)

ALTER TABLE Course
ADD CONSTRAINT fk_student_class
FOREIGN KEY (student_class)
REFERENCES Class (name)
ON DELETE NO ACTION
ON UPDATE CASCADE;