CREATE TABLE Person (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL UNIQUE,
    role varchar(255) NOT NULL
);