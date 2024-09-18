const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");

let nobelek = [];
fs.readFile("nobel.csv", "utf-8", (error, data) => {
    if (error) console.log(error);
    else {
        let sorok = data.split("\r\n");
        for (let sor of sorok) {
            let a = sor.split(";");
            let dij = { ev:a[0], tipus:a[1], keresztnev:a[2], vezetek:a[3] };
            nobelek.push(dij);
        }
    }
});

let server = http.createServer((request, response) => {
    let rUrl = url.parse(request.url, true);
    let pathname = rUrl.pathname;
    let query = rUrl.query;
    response.writeHead(200, "OK", {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin" : "*"
    });

    let urls = [
        "/tipusok -> [ tipus1, ... ]",
        "/dij?tipus=tipus -> [ { ev, tipus, knev, vnev }, ... ]",
        "/dij?ev=ev -> [ { ev, tipus, knev, vnev }, ... ]",
        "/dij?nev=nev -> [ { ev, tipus, knev, vnev }, ... ]"
    ];

    let json = { Error: "Invalid request", urls };

    if (pathname == "/tipusok") json = tipusok();
    if (pathname == "/dij" && query.tipus) json = tipus(query);
    if (pathname == "/dij" && query.ev) json = ev(query);
    if (pathname == "/dij" && query.nev) json = nev(query);

    response.end(JSON.stringify(json));
});

server.listen(88);
console.log("Server is running on port :88");

function calls() {
    

    return url;
}

function tipusok() {
    let set = new Set();
    for (let nobel of nobelek) {
        set.add(nobel.tipus);
    }
    return [ ...set ].sort();
}

function tipus(query) {
    let tomb = []
    for (let nobel of nobelek) {
        if (query.tipus == nobel.tipus) {
            tomb.push(nobel);
        }
    }
    return [ ...tomb ].sort();
}

function ev(query) {
    let tomb = []
    for (let nobel of nobelek) {
        if (query.ev == nobel.ev) {
            tomb.push(nobel);
        }
    }
    return [ ...tomb ].sort();
}

function nev(query) {
    let tomb = []
    for (let nobel of nobelek) {
        if (query.nev == nobel.vezetek) {
            tomb.push(nobel);
        }
    }
    return [ ...tomb ].sort();
}