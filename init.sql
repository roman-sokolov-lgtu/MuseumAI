--
-- PostgreSQL database dump
--

\restrict vJ7fEGGIcghg3eN4eI8HVMccODbW8UBc2RdMXUVnFGh61eJ6cd5w1ipIJ8bQpwz

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.admin (
    admin_id integer NOT NULL,
    admin_login character varying(50) NOT NULL,
    admin_password character varying(100) NOT NULL,
    admin_email character varying(100) NOT NULL UNIQUE
);


ALTER TABLE public.admin OWNER TO "user";

--
-- Name: admin_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.admin_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admin_admin_id_seq OWNER TO "user";

--
-- Name: admin_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.admin_admin_id_seq OWNED BY public.admin.admin_id;


--
-- Name: answer; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.answer (
    answer_id integer NOT NULL,
    answer_text text NOT NULL,
    answer_date timestamp without time zone NOT NULL,
    answer_response_time integer NOT NULL,
    answer_feedback character varying(10),
    query_id integer NOT NULL
);


ALTER TABLE public.answer OWNER TO "user";

--
-- Name: answer_answer_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.answer_answer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.answer_answer_id_seq OWNER TO "user";

--
-- Name: answer_answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.answer_answer_id_seq OWNED BY public.answer.answer_id;


--
-- Name: exhibit; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.exhibit (
    exhibit_id integer NOT NULL,
    exhibit_name character varying(255) NOT NULL,
    exhibit_description text NOT NULL,
    exhibit_qr character varying(255) NOT NULL,
    exhibit_period character varying(100) NOT NULL,
    exhibit_category character varying(100) NOT NULL,
    exhibit_material character varying(255) NOT NULL,
    exhibit_author character varying(255) NOT NULL,
    admin_id integer NOT NULL
);


ALTER TABLE public.exhibit OWNER TO "user";

--
-- Name: exhibit_exhibit_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.exhibit_exhibit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exhibit_exhibit_id_seq OWNER TO "user";

--
-- Name: exhibit_exhibit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.exhibit_exhibit_id_seq OWNED BY public.exhibit.exhibit_id;


--
-- Name: query; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.query (
    query_id integer NOT NULL,
    query_text text NOT NULL,
    query_created timestamp without time zone NOT NULL,
    session_id integer NOT NULL
);


ALTER TABLE public.query OWNER TO "user";

--
-- Name: query_query_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.query_query_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.query_query_id_seq OWNER TO "user";

--
-- Name: query_query_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.query_query_id_seq OWNED BY public.query.query_id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.session (
    session_id integer NOT NULL,
    session_total_questions integer NOT NULL,
    session_start timestamp without time zone NOT NULL,
    session_over timestamp without time zone,
    exhibit_id integer NOT NULL
);


ALTER TABLE public.session OWNER TO "user";

--
-- Name: session_session_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.session_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.session_session_id_seq OWNER TO "user";

--
-- Name: session_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.session_session_id_seq OWNED BY public.session.session_id;


--
-- Name: admin admin_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.admin ALTER COLUMN admin_id SET DEFAULT nextval('public.admin_admin_id_seq'::regclass);


--
-- Name: answer answer_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.answer ALTER COLUMN answer_id SET DEFAULT nextval('public.answer_answer_id_seq'::regclass);


--
-- Name: exhibit exhibit_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.exhibit ALTER COLUMN exhibit_id SET DEFAULT nextval('public.exhibit_exhibit_id_seq'::regclass);


--
-- Name: query query_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.query ALTER COLUMN query_id SET DEFAULT nextval('public.query_query_id_seq'::regclass);


--
-- Name: session session_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.session ALTER COLUMN session_id SET DEFAULT nextval('public.session_session_id_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.admin (admin_id, admin_login, admin_password, admin_email) FROM stdin;
1	admin	$2b$12$2HbXwqs3M83Fl7PffMfWw.OU7aRGldANYOMH.bB0AtRPmw2/KIa6m	admin@museum.ru
\.


--
-- Data for Name: answer; Type: TABLE DATA; Schema: public; Owner: user
--




--
-- Data for Name: exhibit; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.exhibit (exhibit_id, exhibit_name, exhibit_description, exhibit_qr, exhibit_period, exhibit_category, exhibit_material, exhibit_author, admin_id) FROM stdin;

\.


--
-- Data for Name: query; Type: TABLE DATA; Schema: public; Owner: user
--




--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: user
--




--
-- Name: admin_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.admin_admin_id_seq', 1, true);


--
-- Name: answer_answer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.answer_answer_id_seq', 35, true);


--
-- Name: exhibit_exhibit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.exhibit_exhibit_id_seq', 3, true);


--
-- Name: query_query_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.query_query_id_seq', 35, true);


--
-- Name: session_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.session_session_id_seq', 6, true);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (admin_id);


--
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (answer_id);


--
-- Name: exhibit exhibit_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.exhibit
    ADD CONSTRAINT exhibit_pkey PRIMARY KEY (exhibit_id);


--
-- Name: query query_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.query
    ADD CONSTRAINT query_pkey PRIMARY KEY (query_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_id);


--
-- Name: ix_admin_admin_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_admin_admin_id ON public.admin USING btree (admin_id);


--
-- Name: ix_answer_answer_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_answer_answer_id ON public.answer USING btree (answer_id);


--
-- Name: ix_exhibit_exhibit_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_exhibit_exhibit_id ON public.exhibit USING btree (exhibit_id);


--
-- Name: ix_query_query_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_query_query_id ON public.query USING btree (query_id);


--
-- Name: ix_session_session_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_session_session_id ON public.session USING btree (session_id);


--
-- Name: answer answer_query_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_query_id_fkey FOREIGN KEY (query_id) REFERENCES public.query(query_id);


--
-- Name: exhibit exhibit_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.exhibit
    ADD CONSTRAINT exhibit_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin(admin_id);


--
-- Name: query query_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.query
    ADD CONSTRAINT query_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.session(session_id);


--
-- Name: session session_exhibit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_exhibit_id_fkey FOREIGN KEY (exhibit_id) REFERENCES public.exhibit(exhibit_id);


--
-- PostgreSQL database dump complete
--

\unrestrict vJ7fEGGIcghg3eN4eI8HVMccODbW8UBc2RdMXUVnFGh61eJ6cd5w1ipIJ8bQpwz

