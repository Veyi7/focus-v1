CREATE TABLE tasks
(
    id integer NOT NULL IDENTITY(1,1),
    title character varying(500) NOT NULL,
    description text,
    start_date_time datetime NOT NULL,
    creation_date_time datetime NOT NULL,
    done bit NOT NULL DEFAULT 0,
    user_id character varying(500) NOT NULL,
    CONSTRAINT tasks_pkey PRIMARY KEY (id)
)