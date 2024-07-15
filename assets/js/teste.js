function carregaAD() {
    console.log("Iniciando carregaAD...");

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

                            googletag.enableServices();
                            googletag.display(div.id);
                            console.log("Anúncio exibido para:", div.id);
                        });
                    } else {
                        console.log("Nenhum formato correspondente encontrado para", posValue);
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
            googletag.pubads().refresh();
        });
    }

    // Esperar pelo Prebid antes de habilitar os serviços GPT
    pbjs.que.push(function() {
        googletag.cmd.push(function () {
            pbjs.setTargetingForGPTAsync();
            googletag.enableServices();
            console.log("GPT Services Enabled");
        });
    });

    console.log("carregaAD finalizado.");
}

window.addEventListener('load', carregaAD);
