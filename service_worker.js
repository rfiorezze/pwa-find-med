'use strict';

const CACHE_NAME = "find_med_estatico";

const FILES_CACHE = [

    "icons/favicon.ico",
    "css/bootstrap.min.css",
    "css/styles.css",
    "imgs/bg1.jpg",
    "imgs/bg2.jpg",
    "imgs/bg3.jpg",
    "imgs/logo.png",
    "js/bootstrap.bundle.min.js",
    "offline.html",

];

//Tornar o PWA Instalável
self.addEventListener('install', (evt) => {

    console.log("Service Worker: experiência de instalação no navegador");

    evt.waitUntil(

          caches.open(CACHE_NAME).then((cache) => {

            console.log("Service Worker: registrando cache estático");
            return cache.addAll(FILES_CACHE);

          })  

    );

    self.skipWaiting();

});

//Ativar Service Worker
self.addEventListener("activate", (evt) => {

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) =>{

                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }

            }));

        })

  );
  self.clients.claim();

});

//Responder a experiência offline

self.addEventListener('fetch', (evt) =>{

    if(evt.request.mode !== 'navigate'){
        return;
    }

    evt.respondWith(

        fetch(evt.request).catch(() =>{

            return caches.open(CACHE_NAME).then((cache) => {
                return cache.match('offline.html');
            });

        })

    );

});