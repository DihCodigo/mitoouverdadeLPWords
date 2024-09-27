const url = require('url');
const urlString = "https://broto.com.br/catalogsearch/result/?q=Pulverizadores";

function getQueryParam(param, urlString) {
    const parsedUrl = new URL(urlString);
    return parsedUrl.searchParams.get(param);
}

var urlMap = {
    "/": "home",
    "/loja.html": "loja",
    "/loja/maquinas.html": "maquinas",
    "/loja/maquinas/semeadoras-plantadeiras.html": "Semeadoras_Plantadeiras",
    "/loja/maquinas/pulverizadores.html": "Pulverizadores"
};

var valoresUrlMap = Object.values(urlMap);
var queryValue = getQueryParam('q', urlString);
var existeNaLista = valoresUrlMap.includes(queryValue);

console.log(existeNaLista);

var caminho = 'Pulverizadores';
if (existeNaLista && queryValue === caminho) {
    console.log("AdUnit 2111251532/broto/maquinas");
}else if (queryValue != caminho){
    console.log("AdUnit 2111251532/broto/buscador");
}
