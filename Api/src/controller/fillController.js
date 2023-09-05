const fs = require("fs");
const { getConnection } = require("../database/database");
const { error } = require("console");
const connection = getConnection();

exports.crearmodelo = async (req, res) => {
  const result = await connection.query(
    `CREATE TABLE IF NOT EXISTS CIUDADANO(dpi VARCHAR(13) PRIMARY KEY,nombre VARCHAR(50),apellido VARCHAR(50),direccion VARCHAR(100),telefono VARCHAR(15),edad INT,genero VARCHAR(10));`
  );
  const result1 = await connection.query(
    `CREATE TABLE IF NOT EXISTS DEPARTAMENTO(id INT PRIMARY KEY,nombre VARCHAR(50));`
  );
  const result6 = await connection.query(
    `CREATE TABLE IF NOT EXISTS MESA(id INT PRIMARY KEY,departamento INT,FOREIGN KEY (departamento) REFERENCES DEPARTAMENTO(id));`
  );
  const result2 = await connection.query(
    `CREATE TABLE IF NOT EXISTS VOTO(id INT PRIMARY KEY,fecha_hora DATETIME,dpi VARCHAR(13),mesa INT,FOREIGN KEY (dpi) REFERENCES CIUDADANO(dpi),FOREIGN KEY (mesa) REFERENCES MESA(id));`
  );
  const result3 = await connection.query(
    `CREATE TABLE IF NOT EXISTS CARGO(id INT PRIMARY KEY,cargo VARCHAR(50));`
  );
  const result4 = await connection.query(
    `CREATE TABLE IF NOT EXISTS CANDIDATO(id INT PRIMARY KEY,nombre VARCHAR(100),fecha_nac DATE,partido INT, cargo INT,FOREIGN KEY (partido) REFERENCES PARTIDO(id),FOREIGN KEY (cargo) REFERENCES CARGO(id));`
  );
  const result5 = await connection.query(
    `CREATE TABLE IF NOT EXISTS DETALLE_VOTO(candidato INT,voto INT,FOREIGN KEY(candidato) REFERENCES CANDIDATO(id),FOREIGN KEY(voto) REFERENCES VOTO(id));`
  );

  res.send("Modelo creado");
};

exports.eliminarmodelo = async (req, res) => {
  const result5 = await connection.query(`DROP TABLE IF EXISTS DETALLE_VOTO;`);
  const result4 = await connection.query(`DROP TABLE IF EXISTS CANDIDATO;`);
  const result3 = await connection.query(`DROP TABLE IF EXISTS CARGO;`);
  const result2 = await connection.query(`DROP TABLE IF EXISTS VOTO;`);
  const result6 = await connection.query(`DROP TABLE IF EXISTS MESA;`);
  const result = await connection.query(`DROP TABLE IF EXISTS CIUDADANO;`);
  const result1 = await connection.query(`DROP TABLE IF EXISTS DEPARTAMENTO;`);

  res.send("Modelo eliminado");
};

exports.cargartabtemp = async (req, res) => {
  const result = await connection.query(
    `CREATE TABLE IF NOT EXISTS TEMP(id_voto int,id_candidato int,dpi VARCHAR(13),mesa int,fecha_hora datetime);`
  );

  const data = fs.readFileSync("src/csv/votaciones.csv", "utf8");
  let rows = data.split("\r\n");
  rows = rows.slice(1, rows.length - 1);

  for (const element of rows) {
    const row = element.split(";");
    const result1 = await connection.query(
      `INSERT INTO TEMP VALUES(${row[0]},${row[1]},"${row[2]}",${row[3]},"${row[4]}");`
    );
  }

  res.send("Tabla temporal creada");
};

exports.eliminartabtemp = async (req, res) => {
  const result = await connection.query(`DELETE FROM TEMP;`);

  res.send("Tabla temporal eliminada");
};

exports.cargarmodelo = async (req, res) => {
  let data = fs.readFileSync("src/csv/ciudadanos.csv", "utf8");
  let rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla ciudadano
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(
        `INSERT INTO CIUDADANO VALUES("${row[0]}","${row[1]}","${row[2]}","${row[3]}","${row[4]}",${row[5]},"${row[6]}");`
      );
    } catch (error) {}
  }

  data = fs.readFileSync("src/csv/departamentos.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla departamento
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(
        `INSERT INTO DEPARTAMENTO VALUES(${row[0]},"${row[1]}");`
      );
    } catch (error) {}
  }

  data = fs.readFileSync("src/csv/mesas.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla mesa
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(`INSERT INTO MESA VALUES(${row[0]},${row[1]});`);
    } catch (error) {}
  }

  const [result, error] = await connection.query(
    `SELECT id_voto,dpi,mesa,fecha_hora FROM TEMP GROUP BY id_voto,dpi,mesa,fecha_hora;`
  );

  //Cargar datos en la tabla voto
  for (const element of result) {
    try {
      await connection.query(
        `INSERT INTO VOTO VALUES(${element.id_voto},"${element.fecha_hora}","${element.dpi}",${element.mesa});`
      );
    } catch (error) {}
  }

  data = fs.readFileSync("src/csv/partidos.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla partido
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(`INSERT INTO PARTIDO VALUES(${row[0]},"${row[1]}","${row[2]}","${row[3]}");`);
    } catch (error) {}
  }

  data = fs.readFileSync("src/csv/cargos.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla cargo
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(`INSERT INTO CARGO VALUES(${row[0]},"${row[1]}");`);
    } catch (error) {}
  }

  data = fs.readFileSync("src/csv/candidatos.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla candidato
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(`INSERT INTO CANDIDATO VALUES(${row[0]},"${row[1]}","${row[2]}",${row[3]},${row[4]});`);
    } catch (error) {}
  }

  const [result2, error2] = await connection.query(
    `SELECT id_voto,id_candidato FROM TEMP;`
  );

  //Cargar datos en la tabla detalle_voto
  for (const element of result2) {
    try {
      await connection.query(
        `INSERT INTO DETALLE_VOTO VALUES(${element.id_candidato},${element.id_voto});`
      );
    } catch (error) {}
  }
  res.send("Datos cargados");
};
