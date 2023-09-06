DROP DATABASE IF EXISTS PRACTICA1BASES1;
CREATE DATABASE PRACTICA1BASES1;
USE PRACTICA1BASES1;
ALTER SCHEMA PRACTICA1BASES1  DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_spanish_ci ;

CREATE TABLE CIUDADANO(
dpi VARCHAR(13) PRIMARY KEY,
nombre VARCHAR(50),
apellido VARCHAR(50),
direccion VARCHAR(100),
telefono VARCHAR(15),
edad INT,
genero VARCHAR(10)
);

CREATE TABLE DEPARTAMENTO(
id INT PRIMARY KEY,
nombre VARCHAR(50)
);

CREATE TABLE MESA(
id INT PRIMARY KEY,
departamento INT,
FOREIGN KEY (departamento) REFERENCES DEPARTAMENTO(id)
);

CREATE TABLE VOTO(
id INT PRIMARY KEY,
fecha_hora DATETIME,
dpi VARCHAR(13),
mesa INT,
FOREIGN KEY (dpi) REFERENCES CIUDADANO(dpi),
FOREIGN KEY (mesa) REFERENCES MESA(id)
);

CREATE TABLE PARTIDO(
id INT PRIMARY KEY,
nombre VARCHAR(100),
siglas VARCHAR(20),
fecha_funda DATE
);

CREATE TABLE CARGO(
id INT PRIMARY KEY,
cargo VARCHAR(50)
);

CREATE TABLE CANDIDATO(
id INT PRIMARY KEY,
nombre VARCHAR(100),
fecha_nac DATE,
partido INT, 
cargo INT,
FOREIGN KEY (partido) REFERENCES PARTIDO(id),
FOREIGN KEY (cargo) REFERENCES CARGO(id)
);

CREATE TABLE DETALLE_VOTO(
candidato INT,
voto INT,
FOREIGN KEY(candidato) REFERENCES CANDIDATO(id),
FOREIGN KEY(voto) REFERENCES VOTO(id)
);

SELECT count(*) as ciudadano FROM CIUDADANO;
SELECT count(*) FROM CANDIDATO;
SELECT count(*) as partido FROM PARTIDO;
SELECT count(*) as cargo FROM CARGO;
SELECT count(*) as mesa FROM MESA;
SELECT count(*) as voto FROM VOTO;
SELECT count(*) as departamento FROM DEPARTAMENTO;
SELECT count(*) as detalle FROM DETALLE_VOTO;
SELECT * FROM TEMP;

-- Extraer votos
SELECT id_voto,dpi,mesa,fecha_hora FROM TEMP GROUP BY id_voto,dpi,mesa,fecha_hora;

-- Extraer detalle voto
SELECT id_voto,id_candidato FROM TEMP;

-- Presidente y vice por partido
SELECT
    P.nombre AS presidente,
    V.nombre AS vicepresidente,
    PARTIDO.nombre AS partido
FROM
    CANDIDATO AS P
INNER JOIN
    CANDIDATO AS V ON P.partido = V.partido
INNER JOIN
    PARTIDO ON P.partido = PARTIDO.id
WHERE
    P.cargo = 1
    AND V.cargo = 2;

-- Cantidad diputados por partido
SELECT
    Partido.nombre AS partido,
    SUM(CASE WHEN C.cargo = 3 THEN 1 ELSE 0 END) AS "Diputados congreso lista nacional",
    SUM(CASE WHEN C.cargo = 4 THEN 1 ELSE 0 END) AS "Diputados congreso distrito electoral",
    SUM(CASE WHEN C.cargo = 5 THEN 1 ELSE 0 END) AS "Diputados parlamento centroamericano",
    COUNT(C.id) AS "Cantidad de Candidatos"
FROM
    Candidato C
INNER JOIN
    Partido ON C.partido = Partido.id
WHERE
    C.cargo IN (3, 4, 5)
GROUP BY
    Partido.id, Partido.nombre;

-- Alcande por partido
SELECT Partido.nombre as partido, C.nombre as alcalde
FROM Candidato C
INNER JOIN
    PARTIDO Partido ON C.partido = Partido.id
WHERE
    C.cargo=6
;

-- Cantidad candidatos por partido
SELECT P.nombre as partido, 
SUM(CASE WHEN C.cargo = 1 THEN 1 ELSE 0 END) as presidente,
SUM(CASE WHEN C.cargo = 2 THEN 1 ELSE 0 END) as vicepresidente,
SUM(CASE WHEN C.cargo = 3 OR C.cargo = 4 OR C.cargo = 5 THEN 1 ELSE 0 END) as diputados,
SUM(CASE WHEN C.cargo = 6 THEN 1 ELSE 0 END) as alcaldes
FROM 
	PARTIDO P 
INNER JOIN 
	CANDIDATO C ON P.id = C.partido
GROUP BY
	P.nombre, P.id;


-- Votos por departamento
SELECT D.nombre AS DEPARTAMENTO, COUNT(V.id) AS "CANTIDAD DE VOTOS" FROM DEPARTAMENTO D 
INNER JOIN MESA M ON M.departamento = D.id 
INNER JOIN VOTO V ON V.mesa = M.id 
GROUP BY D.nombre, D.id 
;

-- Votos nulos
SELECT COUNT(DISTINCT DV.voto) as "VOTO NULOS" FROM DETALLE_VOTO DV
INNER JOIN VOTO V ON V.id = DV.voto
WHERE DV.candidato = -1;

-- Top edades
SELECT C.edad, COUNT(C.dpi) as Cantidad FROM VOTO V 
INNER JOIN 
CIUDADANO C ON C.dpi = V.dpi 
GROUP BY 
C.edad 
ORDER BY 
COUNT(C.dpi)
DESC LIMIT 10;

-- Top candidatos presidente y vicepresidente
SELECT
    P.nombre AS presidente,
    V.nombre AS vicepresidente,
	COUNT(P.id) AS "Cantidad Votos"
FROM
    CANDIDATO P
INNER JOIN
    CANDIDATO V ON P.partido = V.partido
INNER JOIN 
	DETALLE_VOTO DV ON DV.candidato = P.id 
WHERE
    P.cargo = 1 AND V.cargo = 2
GROUP BY
	P.id, V.id, P.nombre, V.nombre
ORDER BY COUNT(P.id) DESC LIMIT 10;

-- Mesas mas frecuentadas
SELECT V.mesa, D.nombre, COUNT(V.mesa) AS "Cantidad votantes"
FROM VOTO V 
INNER JOIN 
	MESA M ON V.mesa = M.id
INNER JOIN
	DEPARTAMENTO D ON M.departamento = D.id
group by
	M.id
ORDER BY COUNT(V.mesa) Desc;

-- Horas mas frecuentadas
SELECT TIME(V.fecha_hora) AS HORA, COUNT(V.fecha_hora) AS CANTIDAD FROM VOTO V GROUP BY V.fecha_hora ORDER BY COUNT(V.fecha_hora) DESC LIMIT 5;

-- Votos por genero
SELECT C.genero, COUNT(C.genero) AS "Cantidad de votos" FROM CIUDADANO C 
INNER JOIN 
	VOTO V ON C.dpi = V.dpi
GROUP BY
	C.genero;