'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "6aa054760f8857469eb54de2c4306691",
"assets/assets/fonts/Montserrat-ExtraBold.ttf": "19ba7aa52a78c3896558ac1c0a5fb4c7",
"assets/assets/fonts/Montserrat-ExtraLight.ttf": "570a244cacd3d78b8c75ac5dd622f537",
"assets/assets/fonts/Montserrat-Medium.ttf": "c8b6e083af3f94009801989c3739425e",
"assets/assets/images/1.png": "22a78d44a0151d3b132880f2d727e93b",
"assets/assets/images/11.png": "a13ae8d5117167cc4ffc17ea038e5867",
"assets/assets/images/2.png": "06633bd26cbc9184d87754b09c7bce3b",
"assets/assets/images/22.png": "b1c57764937701b2f5767905478ee8e2",
"assets/assets/images/3.png": "614e2aeb1bf41471ef0870dee7acdb78",
"assets/assets/images/33.png": "c7a9bead82336621ea9395a9d8d22c89",
"assets/assets/images/44.png": "62bd9f6fd27a61ebc3615b38bfa6161e",
"assets/assets/images/accessories.png": "44495b6dccc54c8d8886ade9797d286f",
"assets/assets/images/back.jpg": "ab97854a4363f1ebeddf07f30a1dc842",
"assets/assets/images/background2.jpg": "d0eb190b68545a22486ab5e19e0824c9",
"assets/assets/images/calander.png": "20a2d62f0c29e7304a1eee493d00cc65",
"assets/assets/images/curtain.png": "2061bae98f11cd074afdef842cedd3f4",
"assets/assets/images/location%25201.png": "520738514a9cc6809da09080e52c226a",
"assets/assets/images/logo.png": "955b1f9fc8d6e08689dd268687bc0fea",
"assets/assets/images/repair.svg": "bbb9f41d99906b6e92d9897f38eafeda",
"assets/assets/images/seat1.jpg": "c2c4f8ce3ff16ba2cb3692d4ca33b75b",
"assets/assets/images/seat2.jpg": "090a0b4e8cc16da335cb605d52086876",
"assets/assets/images/seat3.jpg": "a682fa6f8f2afc840d494f08a148f768",
"assets/assets/images/seat4.jpg": "f6800be2519f135cffefad955a84161d",
"assets/assets/images/seat5.jpg": "f36a77ad496f00d71093031700dda971",
"assets/assets/images/slide1.jpg": "6ecbd7e3b8572e1cd08cdc90999dcc30",
"assets/assets/images/slide2.jpg": "b7b33efd5eb8c380ac4a02c571facfd0",
"assets/assets/images/slide3.jpg": "56c63f65c1acc78d1baf4e6e36bc6a27",
"assets/assets/images/slide4.jpg": "aae2114a7afa95f7d471570cf7648352",
"assets/assets/images/wave1.jpg": "93d4c4991938151d2df2388b6a3db617",
"assets/assets/images/wave2.jpg": "f254e1ab7619c40b75faa01be1412ad0",
"assets/assets/images/wave3.jpg": "89a6c453d84201e3d335e263fc20c7e3",
"assets/assets/images/wave4.jpg": "85a0b714205cc7a2c205bfdb6c5ca0b2",
"assets/FontManifest.json": "e6c9382d3d0fd46e915440ff8161eab2",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "88d1bd4836ab3223504422eb41c73069",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "6f7dcbc8c509201d62c8293600e831ce",
"/": "6f7dcbc8c509201d62c8293600e831ce",
"main.dart.js": "b4df7bdf1423c1d3dafaed018c4d6b51",
"manifest.json": "c76c4ae73052d2dcc33b3c8db359c8b0",
"version.json": "ec71140c5cf0cf260842a22fb21871bd"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
