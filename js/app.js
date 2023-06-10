if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js')
     .then(registrado => console.log('Se registró el service worker ',registrado))
     .catch(error => console.log('Error no registró el service worker ',error));
  } else{
     console.log('Service worker no soportado!');
  }