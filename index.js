var axios = require('axios');
var WikipediaAPIURL = 'https://{{lang}}.wikipedia.org/w/api.php';
var WikipediaURL = 'https://{{lang}}.wikipedia.org/wiki/{{title}}';

function search(term, options) {
    defaults = {
        limit: 5,
        props: 'snippet',
        lang: 'en'
    };
    options = Object.assign({}, defaults, options);

    var apiUrl = WikipediaAPIURL.replace('{{lang}}', options.lang);
    var ret = axios.get(apiUrl, {
        params: {
            action: 'query',
            srlimit: options.limit,
            srprop: options.props,
            format: 'json',
            list: 'search',
            srsearch: term
        }
    }).then(function(response) {
        var results = response.data.query.search;
        for(var i = 0; i < results.length; i++) {
            var cleanTitle = encodeURIComponent(results[i].title.replace(' ', '_'));
            var url = WikipediaURL
                .replace('{{lang}}', options.lang)
                .replace('{{title}}', cleanTitle);
            results[i].url = url;
        }
        return results;
    });
    return ret;
}
    
function opensearch(term, options) {
    defaults = {
        limit: 5,
        profile: 'fuzzy',
        lang: 'en'
    };
    options = Object.assign({}, defaults, options);

    var ret = axios.get(WikipediaAPIURL, {
        params: {
            action: 'opensearch',
            limit: options.limit,
            format: 'json',
            redirects: 'resolve',
            profile: options.profile,
            search: term
        }
    }).then(function(response) {
        var data = response.data;
        var ret = {
            query: data[0]
        };
        var results = ret.results = [];
        for (var i = 0; i < data[1].length; i++) {
            results.push({ 
                title: data[1][i], 
                summary: data[2][i], 
                url: data[3][i]
            });
        }
        return ret;
    });
    return ret;
}

module.exports.search = search;
module.exports.opensearch = opensearch;
