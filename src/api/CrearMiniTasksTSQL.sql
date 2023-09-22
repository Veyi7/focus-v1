CREATE TABLE minitasks
(
    id integer NOT NULL IDENTITY(1,1),
    title character varying(255) NOT NULL,
    done bit NOT NULL DEFAULT 0,
    taskid integer NOT NULL,
    CONSTRAINT minitasks_pkey PRIMARY KEY (id),
    CONSTRAINT minitasks_taskid_fkey FOREIGN KEY (taskid)
        REFERENCES tasks (id)
)