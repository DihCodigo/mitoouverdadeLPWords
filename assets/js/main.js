console.log("Este é um script personalizado carregado em uma página AMP.");
    
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'pageview',
        'page': {
            'url': window.location.href,
            'title': document.title,
            'path': window.location.pathname
        }
    });
