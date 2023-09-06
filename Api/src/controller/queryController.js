const { getConnection } = require("../database/database");
const { error } = require("console");
const connection = getConnection();

exports.consulta1 = async (req, res) => {
  const result = await connection.query(`SELECT
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
  AND V.cargo = 2;`);

  res.send(result[0]);
};

exports.consulta2 = async (req, res) => {
  const result = await connection.query(`SELECT
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
    Partido.id, Partido.nombre;`);

  res.send(result[0]);
};

exports.consulta3 = async (req, res) => {
  const result =
    await connection.query(`SELECT Partido.nombre as partido, C.nombre as alcalde
    FROM Candidato C
    INNER JOIN
        PARTIDO Partido ON C.partido = Partido.id
    WHERE
        C.cargo=6
    ;`);

  res.send(result[0]);
};

exports.consulta4 = async (req, res) => {
  const result = await connection.query(`SELECT P.nombre as partido, 
  SUM(CASE WHEN C.cargo = 1 THEN 1 ELSE 0 END) as presidente,
  SUM(CASE WHEN C.cargo = 2 THEN 1 ELSE 0 END) as vicepresidente,
  SUM(CASE WHEN C.cargo = 3 OR C.cargo = 4 OR C.cargo = 5 THEN 1 ELSE 0 END) as diputados,
  SUM(CASE WHEN C.cargo = 6 THEN 1 ELSE 0 END) as alcaldes
  FROM 
    PARTIDO P 
  INNER JOIN 
    CANDIDATO C ON P.id = C.partido
  GROUP BY
    P.nombre, P.id;`);

  res.send(result[0]);
};

exports.consulta5 = async (req, res) => {
  const result =
    await connection.query(`SELECT D.nombre AS DEPARTAMENTO, COUNT(V.id) AS "CANTIDAD DE VOTOS" FROM DEPARTAMENTO D 
    INNER JOIN MESA M ON M.departamento = D.id 
    INNER JOIN VOTO V ON V.mesa = M.id 
    GROUP BY D.nombre, D.id 
    ;`);

  res.send(result[0]);
};

exports.consulta6 = async (req, res) => {
  const result =
    await connection.query(`SELECT COUNT(DISTINCT DV.voto) as "VOTO NULOS" FROM DETALLE_VOTO DV
    INNER JOIN VOTO V ON V.id = DV.voto
    WHERE DV.candidato = -1;`);

  res.send(result[0]);
};

exports.consulta7 = async (req, res) => {
  const result =
    await connection.query(`SELECT C.edad, COUNT(C.dpi) as Cantidad FROM VOTO V 
    INNER JOIN 
    CIUDADANO C ON C.dpi = V.dpi 
    GROUP BY 
    C.edad 
    ORDER BY 
    COUNT(C.dpi)
    DESC LIMIT 10;`);

  res.send(result[0]);
};

exports.consulta8 = async (req, res) => {
  const result = await connection.query(`SELECT
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
ORDER BY COUNT(P.id) DESC LIMIT 10;`);

  res.send(result[0]);
};

exports.consulta9 = async (req, res) => {
  const result =
    await connection.query(`SELECT V.mesa, D.nombre, COUNT(V.mesa) AS "Cantidad votantes"
  FROM VOTO V 
  INNER JOIN 
    MESA M ON V.mesa = M.id
  INNER JOIN
    DEPARTAMENTO D ON M.departamento = D.id
  group by
    M.id
  ORDER BY COUNT(V.mesa) Desc LIMIT 5;`);

  res.send(result[0]);
};

exports.consulta10 = async (req, res) => {
  const result = await connection.query(
    `SELECT TIME(V.fecha_hora) AS HORA, COUNT(V.fecha_hora) AS CANTIDAD FROM VOTO V GROUP BY V.fecha_hora ORDER BY COUNT(V.fecha_hora) DESC LIMIT 5;`
  );

  res.send(result[0]);
};

exports.consulta11 = async (req, res) => {
  const result = await connection.query(
    `SELECT C.genero, COUNT(C.genero) AS "Cantidad de votos" FROM CIUDADANO C 
    INNER JOIN 
      VOTO V ON C.dpi = V.dpi
    GROUP BY
      C.genero;`
  );

  res.send(result[0]);
};
