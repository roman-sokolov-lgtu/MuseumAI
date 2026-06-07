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
    admin_email character varying(100) NOT NULL
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
    answer_response_time time without time zone NOT NULL,
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
1	Елецкие вечера	Картина «Елецкие вечера» была написана в 1896 году русским провинциальным живописцем Пётр Фёдорович Васечкин. Работа считается одним из наиболее атмосферных произведений позднего периода мастера и представляет собой лирический городской пейзаж с элементами бытового жанра. Полотно передаёт вечернюю жизнь старинного города Елец конца XIX века, когда купеческие улицы постепенно погружаются в сумерки, а мягкий свет закатного неба отражается в окнах домов и влажной мостовой.\n\nНа переднем плане художник изобразил узкую улочку, уходящую к соборной площади. Неровная булыжная дорога после недавнего дождя блестит под последними лучами солнца. По обеим сторонам улицы расположены двухэтажные купеческие дома с деревянными ставнями, вывесками лавок и коваными фонарями. Некоторые окна уже освещены тёплым жёлтым светом керосиновых ламп, создающим ощущение домашнего уюта и спокойствия.\n\nВ центре композиции заметна небольшая группа горожан: пожилой торговец в длинном сюртуке беседует с извозчиком, рядом проходит женщина в тёмном платке с ребёнком за руку. Их фигуры написаны мягкими мазками и почти растворяются в вечерней дымке. Художник намеренно избегает резкой детализации людей, сосредотачивая внимание зрителя на общем настроении тихого провинциального вечера.\n\nОсобое место в картине занимает небо. Васечкин использует сложные оттенки сиреневого, охристого и холодно-голубого цветов, благодаря чему создаётся ощущение затухающего летнего дня. Вдали возвышаются купола старинных церквей Ельца, слегка скрытые туманом и дымом печных труб. Эти архитектурные силуэты придают работе духовную глубину и подчёркивают связь города с древнерусской традицией.\n\nХудожественная манера автора сочетает элементы реализма и раннего импрессионистического восприятия света. Исследователи творчества Васечкина отмечают его стремление передавать не столько точный вид местности, сколько эмоциональное состояние пространства. Из-за любви художника к изображению куполов, округлых крыш и плавных форм современники дали ему ироничное прозвище «Луковица», которое позднее закрепилось в художественных кругах.\n\nПредположительно картина была создана после поездки художника по южным губерниям Российской империи. В письмах конца 1890-х годов Васечкин упоминал Елец как «город колокольного звона и вечерних теней». Некоторые искусствоведы считают, что именно впечатления от тихих улиц и неспешной жизни города вдохновили мастера на создание этого полотна.\n\nПолотно выполнено маслом на холсте. Для работы характерна многослойная живопись с тонкими лессировками, благодаря которым вечерний свет выглядит почти мерцающим. Размер картины предположительно составлял около 80 × 120 см, что было типично для городских пейзажей конца XIX века.\n\n«Елецкие вечера» относят к редким образцам провинциального русского романтического пейзажа. Картина ценится за внимание к атмосфере старого русского города, тонкую передачу света и ощущение спокойной повседневности дореволюционной эпохи. Экспонат представляет интерес как для исследователей регионального искусства, так и для зрителей, интересующихся культурой русской провинции XIX века.	EXH1	1896г	Живопись	Масло, холст	Васечкин Пётр Фёдорович	1
2	Сумерки над Вяткой	Картина «Сумерки над Вяткой» создана в 1888 году художницей Анна Сергеевна Оболенцева и относится к редким образцам северного городского романтизма конца XIX века. Полотно посвящено вечернему облику старой Вятка — тихого губернского города, окружённого лесами и широкими речными просторами.\n\nКомпозиция картины построена таким образом, будто зритель находится на высоком берегу реки в последние минуты перед наступлением ночи. Внизу раскинулась часть города: деревянные дома с резными наличниками, купеческие склады, узкие переулки и небольшая пристань, где медленно покачиваются баржи. На мокрой после дождя земле отражается тусклый свет редких фонарей. Из печных труб поднимается сизый дым, смешиваясь с холодным вечерним воздухом.\n\nГлавным центром полотна становится река, уходящая вглубь композиции. Вода написана широкими горизонтальными мазками свинцово-серых и тёмно-синих оттенков. На поверхности видны длинные золотистые отражения закатного неба. Художница уделяет большое внимание состоянию природы: чувствуется сырость, прохлада и наступающая осенняя тишина.\n\nНа правой стороне картины изображён высокий соборный холм с белокаменной церковью. Её купола едва освещены последними лучами солнца и выделяются на фоне тяжёлых облаков. Ниже по склону идут несколько прохожих — чиновник в длинном пальто, женщина с корзиной и мальчик, ведущий лошадь под уздцы. Их фигуры малы по сравнению с окружающим пространством, что подчёркивает масштаб природы и самого города.\n\nАнна Оболенцева использовала сложную многослойную технику живописи. Под тёмными слоями краски просматриваются тёплые охристые оттенки, благодаря чему полотно словно светится изнутри. Искусствоведы отмечают влияние русских передвижников, однако в работе также присутствуют черты раннего символизма — прежде всего в особом внимании к настроению и эмоциональной атмосфере.\n\nПо воспоминаниям современников, художница долгое время жила на севере России и стремилась запечатлеть «исчезающую тишину провинциальных городов». «Сумерки над Вяткой» считаются одной из наиболее зрелых её работ. В ней отсутствует парадность или исторический пафос — вместо этого зрителю показывается обычный вечер, наполненный спокойствием, холодным воздухом и ощущением медленного течения времени.\n\nПолотно выполнено маслом на холсте, предположительный размер — 110 × 160 см. Картина представляет интерес как пример редкой женской живописи провинциальной школы конца XIX века и как художественное свидетельство жизни русских губернских городов дореволюционной эпохи.	EXH2	1888г	Живопись	Масло, холст	Анна Сергеевна Оболенцева	1
3	Страж забытой переправы	Скульптура «Страж забытой переправы» представляет собой монументальную фигуру пожилого лодочника, стоящего на грубо обработанном гранитном постаменте. Работа была создана в 1894 году и считается наиболее известным произведением позднего периода творчества Игнатия Рябова, мастера, обращавшегося к образам простых людей русской глубинки.\n\nФигура изображена в полный рост. Старик одет в длинный дорожный кафтан, подпоясанный верёвкой. На плечи наброшен тяжёлый плащ, складки которого ниспадают почти до основания постамента. Правая рука сжимает длинный шест для управления лодкой, а левая придерживает фонарь необычной формы. Лицо скульптуры покрыто глубокими морщинами; взгляд направлен вдаль, словно герой наблюдает за рекой или ожидает путников.\n\nОсобое внимание автор уделил фактуре бронзы. Поверхность одежды намеренно оставлена шероховатой и грубой, тогда как лицо и руки тщательно отполированы. Благодаря этому при музейном освещении создаётся контраст между суровой внешностью персонажа и его внутренней сосредоточенностью.\n\nСогласно авторскому замыслу, лодочник символизирует память о людях, чья работа редко оставалась в истории. В XIX веке переправы через небольшие реки были важной частью жизни многих российских губерний, а перевозчики нередко становились единственной связью между отдалёнными деревнями.\n\nНа гранитном основании высечена надпись:\n\n«Не всякая дорога видна на карте».\n\nИсследователи трактуют эту фразу как размышление о человеческой судьбе и незаметном труде, который поддерживает жизнь общества.\n\nПри осмотре скульптуры с разных сторон можно заметить дополнительные детали: у ног лодочника лежит свёрнутый канат, на поясе висит старинный нож, а на фонаре выгравированы изображения волн и речных птиц. Эти элементы не бросаются в глаза сразу и раскрываются постепенно, побуждая зрителя обходить экспонат кругом.\n\nПредположительно произведение демонстрировалось на региональной художественной выставке в конце XIX века, где получило положительные отзывы за реалистичность и эмоциональную выразительность. Несмотря на отсутствие исторического прототипа, образ воспринимается как собирательный символ русской провинции, её дорог, рек и людей, чьи имена редко сохраняются в хрониках.\n\nСегодня «Страж забытой переправы» рассматривается как образец позднего реалистического направления в русской скульптуре и привлекает внимание посетителей сочетанием монументальности, психологической глубины и тщательно проработанных деталей.	EXH3	1894 г	Скульптура	Бронза, гранит	Игнатий Андреевич Рябов	1
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

