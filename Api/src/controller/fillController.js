const fs = require("fs");
const { getConnection } = require("../database/database");
const { error, Console } = require("console");
const connection = getConnection();

exports.crearmodelo = async (req, res) => {
  // Cración de las tablas del modelo
  const result = await connection.query(
    `CREATE TABLE IF NOT EXISTS CIUDADANO(dpi VARCHAR(13) PRIMARY KEY,nombre VARCHAR(50),apellido VARCHAR(50),direccion VARCHAR(100),telefono VARCHAR(15),edad INT,genero VARCHAR(10));`
  );
  const result1 = await connection.query(
    `CREATE TABLE IF NOT EXISTS DEPARTAMENTO(id INT PRIMARY KEY,nombre VARCHAR(50));`
  );
  const result6 = await connection.query(
    `CREATE TABLE IF NOT EXISTS MESA(id INT PRIMARY KEY,departamento INT,FOREIGN KEY (departamento) REFERENCES DEPARTAMENTO(id));`
  );
  const result7 = await connection.query(
    `CREATE TABLE IF NOT EXISTS PARTIDO(id INT PRIMARY KEY,nombre VARCHAR(100),siglas VARCHAR(20),fecha_funda DATE);`
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
    `CREATE TABLE IF NOT EXISTS DETALLE_VOTO(id int primary key auto_increment, candidato INT,voto INT,FOREIGN KEY(candidato) REFERENCES CANDIDATO(id),FOREIGN KEY(voto) REFERENCES VOTO(id));`
  );

  res.send("Modelo creado");
};

exports.eliminarmodelo = async (req, res) => {
  // Eliminar las tablas del modelo
  const result5 = await connection.query(`DROP TABLE IF EXISTS DETALLE_VOTO;`);
  const result4 = await connection.query(`DROP TABLE IF EXISTS CANDIDATO;`);
  const result3 = await connection.query(`DROP TABLE IF EXISTS CARGO;`);
  const result2 = await connection.query(`DROP TABLE IF EXISTS VOTO;`);
  const result6 = await connection.query(`DROP TABLE IF EXISTS MESA;`);
  const result = await connection.query(`DROP TABLE IF EXISTS CIUDADANO;`);
  const result1 = await connection.query(`DROP TABLE IF EXISTS DEPARTAMENTO;`);
  const result7 = await connection.query(`DROP TABLE IF EXISTS PARTIDO;`);

  res.send("Modelo eliminado");
};

exports.cargartabtemp = async (req, res) => {
  //////////////////////////////// CARGAR DATOS EN TABLAS TEMPORALES ////////////////////////////////

  console.log("CREAR TABLAS TEMPORALES");
  // Creación de las tablas temporales
  await connection.query(
    `CREATE TEMPORARY TABLE IF NOT EXISTS TEMP(id_voto int,id_candidato int,dpi varchar(13),mesa int,fecha_hora datetime);`
  );

  await connection.query(
    `CREATE TEMPORARY TABLE IF NOT EXISTS TEMP_CIUDADANO(dpi varchar(13),nombre varchar(50),apellido varchar(50),direccion varchar(100),telefono varchar(15), edad int, genero varchar(10));`
  );

  await connection.query(
    `CREATE TEMPORARY TABLE IF NOT EXISTS TEMP_DEPARTAMENTO(id int, nombre varchar(50));`
  );

  await connection.query(
    `CREATE TEMPORARY TABLE IF NOT EXISTS TEMP_MESA(id int, departamento int);`
  );

  await connection.query(
    `CREATE TEMPORARY TABLE IF NOT EXISTS TEMP_PARTIDO(id int, nombre varchar(100), siglas varchar(20), fecha_funda date);`
  );

  await connection.query(
    `CREATE TEMPORARY TABLE IF NOT EXISTS TEMP_CARGO(id int, cargo varchar(50));`
  );

  await connection.query(
    `CREATE TEMPORARY TABLE IF NOT EXISTS TEMP_CANDIDATO(id int, nombre varchar(100), fecha_nac date, partido int, cargo int);`
  );

  console.log("TABLAS TEMPORALES CREADAS");
  console.log("CARGAR DATOS EN TABLAS TEMPORALES");

  // Lectura del archivo votaciones.csv
  let data = fs.readFileSync("src/csv/votaciones.csv", "utf8");
  let rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla temp
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(`INSERT INTO TEMP VALUES(?,?,?,?,?);`, [
        row[0],
        row[1],
        row[2],
        row[3],
        row[4],
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("votos cargados");

  // Lectura de los archivos ciudadanos.csv
  data = fs.readFileSync("src/csv/ciudadanos.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla temp_ciudadano
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(
        `INSERT INTO TEMP_CIUDADANO VALUES(?,?,?,?,?,?,?);`,
        [row[0], row[1], row[2], row[3], row[4], row[5], row[6]]
      );
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("ciudadanos cargados");

  // Lectura de los archivos departamentos.csv
  data = fs.readFileSync("src/csv/departamentos.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla temp_departamento
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(`INSERT INTO TEMP_DEPARTAMENTO VALUES(?,?);`, [
        row[0],
        row[1],
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("departamentos cargados");

  // Lectura de los archivos mesas.csv
  data = fs.readFileSync("src/csv/mesas.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla temp_mesa
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(`INSERT INTO TEMP_MESA VALUES(?,?);`, [
        row[0],
        row[1],
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("mesas cargadas");

  // Lectura de los archivos partidos.csv
  data = fs.readFileSync("src/csv/partidos.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla temp_partido
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(`INSERT INTO TEMP_PARTIDO VALUES(?,?,?,?);`, [
        row[0],
        row[1],
        row[2],
        row[3],
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("partidos cargados");

  // Lectura de los archivos cargos.csv
  data = fs.readFileSync("src/csv/cargos.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla temp_cargo
  for (const element of rows) {
    const row = element.split(";");
    try {
      await connection.query(`INSERT INTO TEMP_CARGO VALUES(?,?);`, [
        row[0],
        row[1],
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("cargos cargados");

  // Lectura de los archivos candidatos.csv
  data = fs.readFileSync("src/csv/candidatos.csv", "utf8");
  rows = data.split("\r\n").slice(1, data.length - 1);

  //Cargar datos en la tabla temp_candidato
  for (const element of rows) {
    const row = element.split(",");
    try {
      await connection.query(`INSERT INTO TEMP_CANDIDATO VALUES(?,?,?,?,?);`, [
        row[0],
        row[1],
        row[2],
        row[3],
        row[4],
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("candidatos cargados");

  //////////////////////////////// FIN CARGAR DATOS EN TABLAS TEMPORALES ////////////////////////////////

  console.log("TABLAS TEMPORALES CARGADAS");
  console.log("CARGAR DATOS AL MODELO");

  //////////////////////////////// CARGAR DATOS MODELO ////////////////////////////////
  let [result, error] = await connection.query(`SELECT * FROM TEMP_CIUDADANO;`);

  //Cargar datos en la tabla ciudadano
  for (const element of result) {
    try {
      await connection.query(
        `INSERT INTO CIUDADANO VALUES("${element.dpi}","${element.nombre}","${element.apellido}","${element.direccion}","${element.telefono}",${element.edad},"${element.genero}");`
      );
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("ciudadanos cargados");

  [result, error] = await connection.query(`SELECT * FROM TEMP_DEPARTAMENTO;`);

  //Cargar datos en la tabla departamento
  for (const element of result) {
    try {
      await connection.query(`INSERT INTO DEPARTAMENTO VALUES(?,?);`, [
        element.id,
        element.nombre,
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("departamentos cargados");

  [result, error] = await connection.query(`SELECT * FROM TEMP_MESA;`);

  //Cargar datos en la tabla mesa
  for (const element of result) {
    try {
      await connection.query(`INSERT INTO MESA VALUES(?,?);`, [
        element.id,
        element.departamento,
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("mesas cargadas");

  [result, error] = await connection.query(
    `SELECT id_voto,dpi,mesa,fecha_hora FROM TEMP GROUP BY id_voto,dpi,mesa,fecha_hora;`
  );

  //Cargar datos en la tabla voto
  for (const element of result) {
    try {
      await connection.query(`INSERT INTO VOTO VALUES(?,?,?,?);`, [
        element.id_voto,
        element.fecha_hora,
        element.dpi,
        element.mesa,
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("votos cargados");

  [result, error] = await connection.query(`SELECT * FROM TEMP_PARTIDO;`);

  //Cargar datos en la tabla partido
  for (const element of result) {
    try {
      await connection.query(`INSERT INTO PARTIDO VALUES(?,?,?,?);`, [
        element.id,
        element.nombre,
        element.siglas,
        element.fecha_funda,
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("partidos cargados");

  [result, error] = await connection.query(`SELECT * FROM TEMP_CARGO;`);

  //Cargar datos en la tabla cargo
  for (const element of result) {
    try {
      await connection.query(`INSERT INTO CARGO VALUES(?,?);`, [
        element.id,
        element.cargo,
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("cargos cargados");

  [result, error] = await connection.query(`SELECT * FROM TEMP_CANDIDATO;`);

  //Cargar datos en la tabla candidato
  for (const element of result) {
    try {
      await connection.query(`INSERT INTO CANDIDATO VALUES(?,?,?,?,?);`, [
        element.id,
        element.nombre,
        element.fecha_nac,
        element.partido,
        element.cargo,
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("candidatos cargados");

  [result, error] = await connection.query(
    `SELECT DISTINCT id_voto,id_candidato FROM TEMP;`
  );

  //Cargar datos en la tabla detalle_voto
  for (const element of result) {
    try {
      await connection.query(`INSERT INTO DETALLE_VOTO(candidato, voto) VALUES(?,?);`, [
        element.id_candidato,
        element.id_voto,
      ]);
    } catch (error) {
      console.log("Error: " + error.sql);
      console.log("Error: " + error.sqlMessage);
    }
  }

  console.log("detalle de votos cargados");

  //////////////////////////////// FIN CARGAR DATOS MODELO ////////////////////////////////

  console.log("DATOS CARGADOS AL MODELO");
  console.log("ELIMINAR DATOS TABLAS TEMPORALES");

  //////////////////////////////// ELIMINAR DATOS TABLAS TEMPORALES ////////////////////////////////

  await connection.query(`DELETE FROM TEMP;`);
  await connection.query(`DELETE FROM TEMP_CANDIDATO;`);
  await connection.query(`DELETE FROM TEMP_CARGO;`);
  await connection.query(`DELETE FROM TEMP_PARTIDO;`);
  await connection.query(`DELETE FROM TEMP_MESA;`);
  await connection.query(`DELETE FROM TEMP_DEPARTAMENTO;`);
  await connection.query(`DELETE FROM TEMP_CIUDADANO;`);

  //////////////////////////////// FIN ELIMINAR DATOS TABLAS TEMPORALES ////////////////////////////////

  console.log("DATOS TABLAS TEMPORALES ELIMINADOS");
  res.send("MODELO CARGADO");
};