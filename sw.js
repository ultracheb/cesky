const CACHE='cesky-offline-ca0724c40a86ecb4';
const BASE=self.registration.scope;
const FILES=['index.html','manifest.webmanifest','icon.svg','icon.png'].map(p=>new URL(p,BASE).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('cesky-offline-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data==='check-cache')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const complete=(await Promise.all(FILES.map(f=>cache.match(f)))).every(Boolean);event.ports[0]?.postMessage(complete);})());});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||!event.request.url.startsWith(BASE))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(event.request.mode==='navigate')return (await cache.match(FILES[0]))||fetch(event.request);return (await cache.match(event.request))||fetch(event.request);})());});
