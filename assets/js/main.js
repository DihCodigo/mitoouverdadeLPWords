document.addEventListener('DOMContentLoaded', function() {
    const adUnitIds = ["ad_1", "ad_2", "ad_3", "ad_4"];
    const refreshRate = 10000;
    const dimensions = {
        default: {
            mobile: [[320, 50], [320, 100], [300, 50], [300, 100]],
            desktop: [[970, 250], [970, 90], [728, 90]]
        },
        ad_3: {
            mobile: [[300, 250]],
            desktop: [[300, 250]]
        }
    };

    function getAdDimensions(adUnitId) {
        if (adUnitId === "ad_3") {
            return window.innerWidth > 728 ? dimensions.ad_3.desktop : dimensions.ad_3.mobile;
        } else {
            return window.innerWidth > 728 ? dimensions.default.desktop : dimensions.default.mobile;
        }
    }

    function initializeAd(adUnitId) {
        const adContainer = document.getElementById(adUnitId);
        let adRefreshInterval;
        let debugInterval;
        let elapsedSeconds = 0;
        let slot;

        function defineAdSlot() {
            var googletag = window.googletag || { cmd: [] };
            googletag.cmd.push(function () {
                slot = googletag
                    .defineSlot(
                        "/7542/parceiros/overplay",
                        getAdDimensions(adUnitId),
                        adUnitId
                    )
                    .addService(googletag.pubads())
                    .setTargeting("pos", "header");

                googletag.enableServices();
                googletag.display(adUnitId);
            });
            console.log(`${adUnitId} Carregado: ` + new Date().toLocaleTimeString());
        }

        function refreshAd() {
            var googletag = window.googletag || { cmd: [] };
            googletag.cmd.push(function() {
                googletag.pubads().refresh([slot]);
                console.log(`${adUnitId} Atualizado: ` + new Date().toLocaleTimeString());
            });
        }

        function startAdRefresh() {
            if (!adRefreshInterval) {
                adRefreshInterval = setInterval(refreshAd, refreshRate);
            }
            if (!debugInterval) {
                debugInterval = setInterval(() => {
                    elapsedSeconds++;
                    console.log(`${adUnitId} - Segundos: ` + elapsedSeconds);
                }, 1000);
            }
        }

        function stopAdRefresh() {
            if (adRefreshInterval) {
                clearInterval(adRefreshInterval);
                adRefreshInterval = null;
            }
            if (debugInterval) {
                clearInterval(debugInterval);
                debugInterval = null;
            }
            elapsedSeconds = 0;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    adContainer.style.display = 'block';
                    if (!slot) {
                        defineAdSlot();
                    }
                    startAdRefresh();
                } else {
                    stopAdRefresh();
                }
            });
        });
        observer.observe(adContainer);
    }
    adUnitIds.forEach(initializeAd);
});