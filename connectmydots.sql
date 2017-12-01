--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: account; Type: TABLE; Schema: public; Owner: brad
--

CREATE TABLE account (
    id text NOT NULL,
    password text NOT NULL,
    profile jsonb DEFAULT '{}'::json
);


ALTER TABLE account OWNER TO brad;

--
-- Name: map; Type: TABLE; Schema: public; Owner: brad
--

CREATE TABLE map (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    owner text NOT NULL,
    data jsonb NOT NULL,
    name text NOT NULL,
    is_public boolean DEFAULT false NOT NULL,
    last_update timestamp without time zone DEFAULT now()
);


ALTER TABLE map OWNER TO brad;

--
-- Name: session; Type: TABLE; Schema: public; Owner: brad
--

CREATE TABLE session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE session OWNER TO brad;

--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: brad
--

ALTER TABLE ONLY account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: brad
--

ALTER TABLE ONLY session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: map map_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brad
--

ALTER TABLE ONLY map
    ADD CONSTRAINT map_owner_fkey FOREIGN KEY (owner) REFERENCES account(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

