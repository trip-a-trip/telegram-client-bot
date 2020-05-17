CREATE TABLE public.account (
  "id"           varchar NOT NULL,
  "user_id"      varchar NOT NULL
);

ALTER TABLE ONLY public.account
  ADD CONSTRAINT "PK_account" PRIMARY KEY (id);

#DOWN

DROP TABLE public.account;
