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

SELECT * FROM CIUDADANO;
SELECT * FROM CANDIDATO;
SELECT * FROM PARTIDO;
SELECT * FROM CARGO;
SELECT * FROM MESA;
SELECT * FROM VOTO;
SELECT * FROM DEPARTAMENTO;
SELECT * FROM DETALLE_VOTO;
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
SELECT Partido.nombre as partido, count(C.id) as "Cantidad de Candidatos"
FROM Candidato C
INNER JOIN
    PARTIDO Partido ON C.partido = Partido.id
WHERE
    C.cargo=3 OR C.cargo=4 OR C.cargo=5
GROUP BY
    Partido.id, PARTIDO.nombre
;

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
(SELECT COUNT(*) FROM CANDIDATO WHERE cargo = 1 AND partido=P.id) as presidentes,
(SELECT COUNT(*) FROM CANDIDATO WHERE cargo = 2 AND partido=P.id) as vicepresidentes,
(SELECT COUNT(*) FROM CANDIDATO WHERE (cargo = 3 OR cargo = 4 OR cargo = 5) AND partido=P.id) as diputados,
(SELECT COUNT(*) FROM CANDIDATO WHERE cargo = 6 AND partido=P.id) as alcaldes
FROM PARTIDO P;

-- Votos por departamento
SELECT D.nombre AS DEPARTAMENTO, COUNT(DV.voto) AS "CANTIDAD DE VOTOS" FROM DEPARTAMENTO D 
INNER JOIN MESA M ON M.departamento = D.id 
INNER JOIN VOTO V ON V.mesa = M.id 
INNER JOIN DETALLE_VOTO DV ON DV.voto = V.id
GROUP BY D.nombre, D.id 
;

-- Votos nulos
SELECT COUNT(*) AS NULOS FROM DETALLE_VOTO WHERE candidato = -1;