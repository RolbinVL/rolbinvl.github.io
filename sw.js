/*para manejar el caching de la PWA  en caso de no tener conexión
  a internet. También si el sitio ya fue visitado cargará los datos
  de la cache para no volver a acceder al sitio.
  Las paginas se guardan como pagina A caché A, página B caché B
*/
const nombreCache = 'cdg-v1';
const archivos = [
  '/',          //la página principal o sea 127.0.0.1:5500
  '/index.html',//el archivo principal a renderizar
  '/css/bootstrap.min.css',
  '/css/custom.css',
  '/js/app.js',
  '/js/appV.js',
  'funtion.js'
];
//instalar el service worker
self.addEventListener('install', e=>{
    console.log('Instalado el service worker');
     //espera a que se hayan descargado todos lo cache de archivos
    e.waitUntil(
        caches.open(nombreCache)
        .then(cache => {                   //un promise para cargar caché
            console.log('cacheando');
            cache.addAll(archivos)  //cache.add(archivo); si fuera un solo archivo en caché
        })
    )
});
self.addEventListener('activate', e=>{
    console.log('Activado el service worker');
})

//evento fetch para descargar archivos estatico.

self.addEventListener('fetch', e=>{
    console.log('Fetch ...', e)    

    //para cargar los elementos de caché
    e.respondWith(
       caches.match(e.request)  //busca lo que tengamos en caché
          .then(respuestaCache => {  //si es positivo...
            return respuestaCache  //carga lo que hay en caché
    })
    )
})
