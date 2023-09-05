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
  const result =
    await connection.query(`SELECT Partido.nombre as partido, count(C.id) as "Cantidad de Candidatos"
    FROM Candidato C
    INNER JOIN
        PARTIDO Partido ON C.partido = Partido.id
    WHERE
        C.cargo=3 OR C.cargo=4 OR C.cargo=5
    GROUP BY
        Partido.id, PARTIDO.nombre
    ;`);

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
    const result =
      await connection.query(`SELECT P.nombre as partido, 
      (SELECT COUNT(*) FROM CANDIDATO WHERE cargo = 1 AND partido=P.id) as presidentes,
      (SELECT COUNT(*) FROM CANDIDATO WHERE cargo = 2 AND partido=P.id) as vicepresidentes,
      (SELECT COUNT(*) FROM CANDIDATO WHERE (cargo = 3 OR cargo = 4 OR cargo = 5) AND partido=P.id) as diputados,
      (SELECT COUNT(*) FROM CANDIDATO WHERE cargo = 6 AND partido=P.id) as alcaldes
      FROM PARTIDO P;`);
  
    res.send(result[0]);
  };

  exports.consulta5 = async (req, res) => {
    const result =
      await connection.query(`SELECT D.nombre AS DEPARTAMENTO, COUNT(DV.voto) AS "CANTIDAD DE VOTOS" FROM DEPARTAMENTO D 
      INNER JOIN MESA M ON M.departamento = D.id 
      INNER JOIN VOTO V ON V.mesa = M.id 
      INNER JOIN DETALLE_VOTO DV ON DV.voto = V.id
      GROUP BY D.nombre, D.id 
      ;`);
  
    res.send(result[0]);
  };