CREATE TABLE public."callback_data" (
  "id"   varchar NOT NULL,
  "data" jsonb   NOT NULL
);

ALTER TABLE ONLY public."callback_data"
  ADD CONSTRAINT "PK_callback_data" PRIMARY KEY (id);

#DOWN

DROP TABLE public."callback_data";
