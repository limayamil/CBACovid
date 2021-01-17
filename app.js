var Twit = require("twit");
const scrapeIt = require("scrape-it");
const url =
  "https://en.wikipedia.org/wiki/Template:COVID-19_pandemic_data/Argentina_medical_cases";
const regExp2 = / *\([^)]*\) */g;
let cantidadTotalHoy;
let cantidadTotalAyer;
let nuevosHoy;
let cantidadNuevos;
let fechaExtraida;
let fechaSistemaToday = new Date();
let fechaSistemaDia = fechaSistemaToday.getDate();

var T = new Twit({
  consumer_key: "Lpm02syN91HzkI7mJX7ZPJr05",
  consumer_secret: "KwkkoJkzY0K8fem4PGt8sAK88wQEZXlAWGfhmKJgOv6zqz2P5U",
  access_token: "1350569230786318342-LKRweSil3CjKCH7R0faIy6DGG8erQo",
  access_token_secret: "E62HPTW8VIOW8qTvi7bxwSFucVViTJyFcOUJ0Z4jrpLmD",
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

scrapeIt(url, {
  filaHoy:
    "#mw-content-text > div.mw-parser-output > div.noresize > table > tbody > tr:nth-last-child(5) > td:nth-child(7)",
  filaAyer:
    "#mw-content-text > div.mw-parser-output > div.noresize > table > tbody > tr:nth-last-child(6) > td:nth-child(7)",
  fecha:
    "#mw-content-text > div.mw-parser-output > div.noresize > table > tbody > tr:nth-last-child(5) > th",
}).then(({ data, response }) => {
  console.log(`Status Code: ${response.statusCode}`);
  cantidadTotalHoy = JSON.stringify(data.filaHoy)
    .replace(/ *\([^)]*\) */g, "")
    .replace(/['"]+/g, "");
  cantidadTotalHoy = parseInt(cantidadTotalHoy);
  console.log("Cantidad total de hoy: " + cantidadTotalHoy);

  cantidadTotalAyer = JSON.stringify(data.filaAyer)
    .replace(/ *\([^)]*\) */g, "")
    .replace(/['"]+/g, "");
  cantidadTotalAyer = parseInt(cantidadTotalAyer);
  console.log("Cantidad total de ayer: " + cantidadTotalAyer);

  nuevosHoy = cantidadTotalHoy - cantidadTotalAyer;
  console.log("Los nuevos casos de hoy: " + nuevosHoy);

  //console.log(fechaExtraida);
  //console.log(fechaSistemaDia);

  if (fechaExtraida == fechaSistemaDia) {
    T.post(
      "statuses/update",
      {
        status:
          "Hoy hubieron " +
          nuevosHoy +
          " nuevos pacientes de COVID-19 en Córdoba, Argentina.",
      },
      function (err, data, response) {
        console.log(data);
      }
    );
  } else {
    console.warn("La fecha no coincide, la Wiki está desactualizada.");
    T.post(
      "statuses/update",
      {
        status: "Aún no hay datos actualizados",
      },
      function (err, data, response) {
        console.log(data);
      }
    );
  }
});
