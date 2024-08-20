function carregarAD() {
    var googletag = window.googletag || { cmd: [] };
    var pbjs = window.pbjs || { que: [] };
    var adUnits = [];
    var ids = ["r7_header", "r7_texto_1", "r7_texto_3", "r7_texto_lateral"];
  
    ids.forEach(function(id) {
        var div = document.getElementById(id);
        if (!div) return;
        
        //DEBUG
        console.log("Configurando AdUnit para ID: ", id);
        var sizes = [];
        var isMobile = window.innerWidth <= 768;

        if (isMobile) {
            if (id === "r7_header") {
                sizes = [[320, 50]];
            } else if (id === "r7_texto_1") {
                sizes = [[320, 50]];
            } else if (id === "r7_texto_3") {
                sizes = [[300, 250]];
            }
        } else {
            if (id === "r7_header") {
                sizes = [[970, 250]];
            } else if (id === "r7_texto_1") {
                sizes = [[728, 90]];
            } else if (id === "r7_texto_3") {
                sizes = [[300, 250]];
            }
        }

        adUnits.push({
            code: id,
            mediaTypes: {
                banner: {
                    sizes: sizes,
                    path: "/7542/r7home",
                }
            },
            bids: [
                { bidder: 'appnexus', params: { placementId: '-' } },
                { bidder: 'rubicon', params: { accountId: 18966, siteId: 552008, zoneId: 3456976 } },
                { bidder: 'smartadserver', params: { domain: '//prg.smartadserver.com', siteId: 669594, pageId: 2000293, formatId: 133313, currency: 'USD' } },
            ]
        });
    });

    pbjs.que.push(function() {
        pbjs.addAdUnits(adUnits);
        pbjs.requestBids({
            bidsBackHandler: function() {
                ids.forEach(function(id) {
                    var div = document.getElementById(id);
                    if (!div) return;

                    var format = adUnits.find(function(format) {
                        return format.code === id;
                    });

                    if (format) {
                        googletag.cmd.push(function () {
                            var slot = googletag
                                .defineSlot(
                                    format.mediaTypes.banner.path,
                                    format.mediaTypes.banner.sizes,
                                    id
                                )
                                .addService(googletag.pubads());

                            slot.setTargeting('pos', format.code);
                        });
                    }
                });

                initAdServer();
            }
        });
    });

    function initAdServer() {
        if (pbjs.initAdserverSet) return;
        pbjs.initAdserverSet = true;
        googletag.cmd.push(function() {
            pbjs.setTargetingForGPTAsync();
            googletag.enableServices();
            googletag.pubads().refresh();
        });
    }

    pbjs.que.push(function() {
        googletag.cmd.push(function () {
            googletag.pubads().enableLazyLoad({
                fetchMarginPercent: 200,
                renderMarginPercent: 50,
                mobileScaling: 2.0 
            });
            googletag.pubads().addEventListener('slotRequested', function(event) {
                //DEBUG
                console.log("Slot Requisitado: ", event.slot.getSlotElementId());
            });

            googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                //DEBUG
                //console.log("Renderização finalizada: ", event.slot.getSlotElementId());
            });
        });
    });

    var visibleAds = new Set();

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function requestAdsInViewport() {
        ids.forEach(function(id) {
            var div = document.getElementById(id);
            if (!div) return;

            if (isElementInViewport(div)) {
                if (!visibleAds.has(div.id)) {
                    googletag.cmd.push(function () {
                        googletag.display(div.id);
                    });
                    visibleAds.add(div.id);

                    //DEBUG
                    console.log("Anuncio exibido para ID: ", div.id);
                }
            } else {
                visibleAds.delete(div.id);
            }
        });
    }

    function refreshAds() {
        var slots = [];
        ids.forEach(function(id) {
            var div = document.getElementById(id);
            if (!div) return;

            if (isElementInViewport(div)) {
                var slot = googletag.pubads().getSlots().find(function(slot) {
                    return slot.getSlotElementId() === div.id;
                });
                if (slot) {
                    slots.push(slot);
                }
            }
        });

        if (slots.length > 0) {
            pbjs.requestBids({
                adUnits: adUnits,
                bidsBackHandler: function() {
                    pbjs.setTargetingForGPTAsync();
                    googletag.pubads().refresh(slots);

                    //DEBUG
                    function getSlotElementId(slot) {
                        return slot.getSlotElementId();
                    }
                    
                    console.log("Atualização de anuncios: ", slots.map(getSlotElementId));
                }
            });
        }
    }

    window.addEventListener('scroll', requestAdsInViewport);
    window.addEventListener('resize', requestAdsInViewport);
    window.addEventListener('load', requestAdsInViewport);

    setInterval(refreshAds, 15000);
}

window.addEventListener('load', carregarAD);
