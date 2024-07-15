//<script async src="https://tpc.googlesyndication.com/pimgad/11651232775554394622"></script>
//<script async type="text/javascript" src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
function carregaAD() {
    var googletag = window.googletag || { cmd: [] };
    var pbjs = window.pbjs || { que: [] };

    var divsCompletas = document.querySelectorAll('[id^="googleAd"]');
    console.log("Número de divs encontradas:", divsCompletas.length);

    var adUnits = [];
    divsCompletas.forEach(function(div) {
        var targetingValue = JSON.parse(div.getAttribute('data-targeting'));
        console.log("Div ID:", div.id);
        console.log("Targeting Value:", targetingValue);

        var posValue = targetingValue[1][0];
        var sizes = [[300, 250]];

        if (div.id === "googleAd1" || posValue === "usFullsupH1") {
            sizes = [[300, 250]];
        } else if (div.id === "googleAd2" || posValue === "usFullsupH2") {
            sizes = [[728, 90]];
        } else if (div.id === "googleAd3" || posValue === "usFullsupH3") {
            sizes = [[728, 90]];
        }

        adUnits.push({
            code: div.id,
            mediaTypes: {
                banner: {
                    sizes: sizes,
                    path: "/7542/parceiros/BelezaDeMulher",
                    pos: posValue
                }
            },
            bids: [
                { bidder: 'appnexus', params: { placementId: '-' } },
                { bidder: 'rubicon', params: { accountId: 18966, siteId: 552008, zoneId: 3456976 } },
                { bidder: 'smartadserver', params: { domain: '//prg.smartadserver.com', siteId: 669594, pageId: 2000293, formatId: 133313, currency: 'USD' } },
                { bidder: 'sovrn', params: { tagid: '-' } }
            ]
        });
    });

    pbjs.que.push(function() {
        pbjs.addAdUnits(adUnits);
        pbjs.requestBids({
            bidsBackHandler: function() {
                divsCompletas.forEach(function(div) {
                    var targetingValue = JSON.parse(div.getAttribute('data-targeting'));
                    var posValue = targetingValue[1][0];

                    var format = adUnits.find(function(format) {
                        return format.mediaTypes.banner.pos === posValue && format.code === div.id;
                    });

                    if (format) {
                        console.log("Formato encontrado:");
                        console.log("-> ID: ", div.id);
                        console.log("-> Posição: ", format.mediaTypes.banner.pos);

                        googletag.cmd.push(function () {
                            var slot = googletag
                                .defineSlot(
                                    format.mediaTypes.banner.path,
                                    format.mediaTypes.banner.sizes,
                                    div.id
                                )
                                .addService(googletag.pubads());

                            slot.setTargeting('pos', format.mediaTypes.banner.pos);
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
                console.log('Espaço de anúncio solicitado:', event.slot.getSlotElementId());
            });

            googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                console.log('A renderização do local do anúncio foi encerrada:', event.slot.getSlotElementId(), 'está vazia:', event.isEmpty);
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
        var divsCompletas = document.querySelectorAll('[id^="googleAd"]');
        divsCompletas.forEach(function(div) {
            if (isElementInViewport(div)) {
                if (!visibleAds.has(div.id)) {
                    console.log('Solicitando anúncio para: ' + div.id);
                    googletag.cmd.push(function () {
                        googletag.display(div.id);
                    });
                    visibleAds.add(div.id);
                }
            } else {
                visibleAds.delete(div.id);
            }
        });
    }

    function refreshAds() {
        var slots = [];
        divsCompletas.forEach(function(div) {
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
                }
            });
        }
    }

    window.addEventListener('scroll', requestAdsInViewport);
    window.addEventListener('resize', requestAdsInViewport);
    window.addEventListener('load', requestAdsInViewport);

    setInterval(refreshAds, 30000);
}

window.addEventListener('load', carregaAD);
