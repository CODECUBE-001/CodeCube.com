const phpFuncs = siteDir + '/core/php/amvc.php';
const reqURI = window.location.pathname;
var lastPage = curPage;
var aLoadHistory = [curPage];
var routes;
var temp;
var xck;
var loadtime;
var ltimecounter;
var AMVCdata = { init: 'home' };

var pUri = window.location.href.split('/');
pUri[pUri.length - 1] = '';
const pathURI = pUri.join('/');

const cTrim = (str, char) => {
    str = str.split('');
    if (str[0] == char) str[0] = ''; // while (str[0] == char) str[0] = '';

    if (str[str.length - 1] == char) // while (str[str.length - 1] == char) str[str.length - 1] = '';
        str[str.length - 1] = '';

    return str.join('');
};

const aHistorize = (pageTitle, routeTitle) => {
    routeTitle = routeTitle.toLowerCase();
    window.history.pushState({ "pageTitle": pageTitle, "historyIndex": (aLoadHistory.length - 1) }, "", siteDir + '/' + routeTitle);
    aLoadHistory.push(routeTitle);
    curPage = routeTitle;
};

window.onpopstate = e => {
    loader.start();
    let popsatateurl = window.location.href;
    ajax(null, popsatateurl, e = e => {
        appndToBody(e);
        curpage = window.location.href.split('');
        refreshCode();
        loader.stop();
    });
};

const handleLinks = () => {
    //return;
    var links = document.getElementsByTagName('*');

    for (let link of links) {
        if (link.getAttribute('rooted')) {
            // what to do here bro ?
        }

        if (link) {
            if (link.href)
                link.href = link.href.replace(pathURI, siteDir + '/');

            if (link.src)
                link.src = link.src.replace(pathURI, siteDir + '/');
        }
    }
};

const stopAllIntervals = () => {
    let lastInterval = setInterval(() => {}, 9999);
    for (let i of lastInterval)
        clearInterval(i);
};

const handlerouters = () => {
    let links = document.getElementsByTagName('*');

    for (let link of links) {
        let actv_cls = link.getAttribute('is-active') ? link.getAttribute('is-active') : 'active';

        if (link.getAttribute('route')) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                new AMVC().loadModel(event.currentTarget.getAttribute('route'));
            });

            if (link.getAttribute('route').toLowerCase() == curPage.toLowerCase())
                link.classList.add(actv_cls);

            link.style.cursor = "pointer";
        }
    }
};

var loader = {
    start: () => {
        loadtime = 0;
        ltimecounter = setInterval(() => loadtime++, 1);
        console.log('changing..route');
        document.body.style.animation = "fadeIn 2s infinite";
    },
    stop: () => {
        clearInterval(ltimecounter);
        console.log('changed..route within ' + loadtime + 'ms');
        document.body.style.animation = "";
    },
};

const getMVChandler = (propty, cbk) => {
    var fd = new FormData();
    fd.append('cmd', '_get_mvc');
    fd.append('data', reqURI);
    fd.append('data2', propty);

    ajax(fd, phpFuncs, function(output) {
        if (propty == 'controllers')
            output = JSON.parse(output);

        cbk(output);
    });
};

const ajax = (data, url, hd, method = 'POST') => {

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            hd(xmlhttp.responseText);
    };

    xmlhttp.open(method, url, true);
    xmlhttp.send(data);
    return;
};

/** 
 * @author Bro johnson
 **/

function paginate(data_to, per_page) {
    let arrLimit = Math.round((data_to.length / per_page) * 2);
    let arrIndex = 1;
    let temparr = [];
    let returnarr = [];

    if (data_to.length > per_page) {

        for (let p_i = arrIndex; p_i < arrLimit; p_i++)
            temparr.push(data_to.slice((p_i - 1) * per_page, p_i * per_page));

        for (let item of temparr)
            item.length > 0 ? returnarr.push(item) : null;

    } else
        returnarr.push(data_to);

    return returnarr;
}

const handleTemplating = () => {
    const a_tpl = document.querySelectorAll('#AMVCtpl');

    for (let at_i of a_tpl) {
        var ww_t = a_tpl[0].innerHTML; // i think it meant 'at_i'
        ww_t = ww_t.split('|$|');
    }
};

const handleVform = () => {
    const a_tpl = document.querySelectorAll('form');

    for (let at_i of a_tpl) {

        if (at_i.getAttribute('async') == 'true') {

            at_i.onsubmit = event => {
                event.preventDefault();
                var i_nputs = event.currentTarget.querySelectorAll('*');
                var submit_url = siteDir + "/core/amvc_interactor.php";
                var v_form = new FormData();

                if (event.currentTarget.method.toLowerCase() == 'get') {
                    submit_url += "?";

                    for (let input of i_nputs) {

                        if (input.name.length > 0) {
                            if (input.type == 'file')
                                v_form.append(input.name, input.files);
                            else
                                submit_url += input.name + "=" + input.value + "&";
                        }
                    }
                    submit_url = submit_url.replace(/[&]$/g, '');

                } else {

                    for (let input of inputs)
                        v_form.append(input.name, input.type == 'file' ? input.files : input.vlaue);
                }

                v_form.append('_ita_', event.currentTarget.getAttribute('interactor'));
                ajax(v_form, submit_url, eval(event.currentTarget.getAttribute('callback')));
            };
        }
    }
};

function genHTML(pattern) {
    pattern = pattern.split('>');
    let last_el = null;

    for (let cn of pattern) {

        let c_patn = pattern[cn];
        if (!c_patn.includes('#') && !c_patn.includes('.'))
            c_patn += ".";

        let el_type = '.';
        if (c_patn.includes('#'))
            el_type = '#';

        c_patn = c_patn.split(el_type);

        let cur_el = document.createElement(c_patn[0]);
        if (el_type == '#')
            cur_el.id = c_patn[1];
        else
            cur_el.className = c_patn[1];

        if (last_el == null)
            last_el = cur_el;
        else
            last_el.appendChild(cur_el);
    }
    return last_el;
}

class AMVC {
    initModel(mdl) { AMVCdata.init = mdl; }

    routes(currentRoutes) {
        currentRoutes.push({ route: '$', script: '$' });
        let comparisonRoute = cTrim(window.location.pathname.toLowerCase(), '/').split('/');
        let mainRoute = [];
        let validRoutes = [];

        for (let currentRoute of currentRoutes) {
            let routeValues = '{';
            let comparisonRouteSliced = comparisonRoute;

            currentRoute.route = cTrim(currentRoute.route.toLowerCase(), '/').split('/');

            for (let i = 0; i < currentRoute.route.length; i++) {
                if (currentRoute.route[i] == '*') {
                    comparisonRouteSliced = comparisonRoute.slice(0, i);
                    currentRoute.route = currentRoute.route.slice(0, i);
                    break;
                }
            }

            if (currentRoute.route.length == comparisonRouteSliced.length) {

                for (let i = 0; i < currentRoute.route.length; i++) {
                    if (currentRoute.route[i][0] == '{') {
                        currentRoute.route[i] = currentRoute.route[i].replace(/^[{]/g, '').replace(/[}]$/g, '').split(':');
                        let currentValue = comparisonRouteSliced[i].match(currentRoute.route[i][1]);
                        routeValues += '"' + currentRoute.route[i][0] + '":"' + currentValue + '"';
                        currentRoute.route[i] = currentRoute.route[i][1];
                    }
                    mainRoute.push(currentRoute.route[i]);
                }
                routeValues += '}';
                routeValues = JSON.parse(routeValues);
                let mainRouteNow = mainRoute.join('/');
                let comparisonRouteNow = comparisonRouteSliced.join('/');

                if (comparisonRouteNow.match(mainRouteNow)) {
                    if (comparisonRouteNow.match(mainRouteNow)[0].length == comparisonRouteNow.length) {
                        currentRoute.script(routeValues);
                        validRoutes.push(currentRoute);
                    }
                }
                mainRoute = [];
                routeValues = '';
            }
        }
        return validRoutes;
    }

    getRoutes(callback) {
        var fd = new FormData();
        fd.append('cmd', '_all_routes');
        ajax(fd, phpFuncs, function(output) {
            output = Object.entries(JSON.parse(output));
            callback(output);
        });
    }

    load(url, tEl) {
        tEl = {
            element: tEl.split(' ')[0],
            index: tEl.split(' ')[1] ? tEl.split(' ')[1] : 0,
        };
        url = {
            url: url.split(' ')[0],
            element: url.split(' ')[1] ? url.split(' ')[1] : 'body',
        };
        ajax(null, url.url, function(output) {
            output = new DOMParser().parseFromString(output, "text/html").querySelectorAll(url.element);
            output.forEach(element => {
                document.querySelectorAll(tEl.element)[tEl.index].innerHTML = element.innerHTML;
            });
        });
    }

    getValues(callback) {
        callback ? getMVChandler('_controllers', callback) : console.error('too few arguments supplied');
    }


    SQLgetArray(callback, sql) {
        if (callback && sql) {
            let fd = new FormData();
            fd.append('cmd', '_sql_get_array');
            fd.append('data', sql);
            fd.append('data2', 'vYPnT7Ug');
            ajax(fd, phpFuncs, output => callback(JSON.parse(output)));
        } else
            console.error('too few arguments supplied');
    }

    asyncLoad(url) {
        if (!url) url = '';

        url = url.replace(/^[/]/g, '');

        let Lurl = siteDir + '/' + url;
        loader.start();
        stopAllIntervals();
        ajax(null, Lurl, e => {
            appndToBody(e);
            let pageTitle = new DOMParser().parseFromString(e, "text/html").title;
            aHistorize(pageTitle, url);
            document.title = pageTitle;
            setTimeout(() => {
                refreshCode();
                loader.stop();
            }, 500);
        });
    }

    asyncReload() {
        loader.start();
        stopAllIntervals();
        ajax(null, curPage, function(output) {
            document.body.innerHTML = output;
            setTimeout(() => {
                refreshCode();
                loader.stop();
            }, 500);
        });
    }

    loadModel(url) {
        if (!url) url = '';

        loader.start();
        stopAllIntervals();
        var fd = new FormData();
        fd.append('cmd', '_route');
        fd.append('data', url);

        ajax(fd, phpFuncs, function(output) {
            //console.log(output);
            output = JSON.parse(output);
            ajax(null, siteDir + '/' + output.title, function(e) {
                appndToBody(e);
                output.docTitle = new DOMParser().parseFromString(e, "text/html").title;
                aHistorize(output.docTitle, output.title);

                if (output.title.length < 1)
                    output.title = AMVCdata.init;

                document.title = output.docTitle;
                curPage = output.title;
                setTimeout(() => {
                    refreshCode();
                    loader.stop();
                }, 500);

            });
        });
    }
}

const print = {
    toEl: (el, str) => {
        if (!str) str = '';

        if (elm = document.querySelector(el))
            return elm.innerHTML = str;
        else
            return console.error('Error: the element "' + el + '" specified is not found');

    },
    inEl: (el, str) => {
        if (!str) str = '';

        if (elm = document.querySelector(el))
            return elm.innerHTML += str;
        else
            return console.error('Error: the element "' + el + '" specified is not found');

    },
    asEl: (el, str) => {
        if (!str) str = '';

        if (document.querySelector(el))
            return document.querySelector(el).outerHTML = str;
        else
            return console.error('Error: the element "' + el + '" specified is not found');

    },
    out: (str) => {
        if (!str) str = '';
        return document.write(str);
    },
    in: (str) => {
        if (!str) str = '';
        return console.log(str);
    }
};

let checkLoad = setInterval(() => {
    if (document.body) {
        handleLinks();
        handlerouters();
        handleVform();
        clearInterval(checkLoad);
    }
}, 1);


const refreshCode = () => {
    handlerouters();
    handleVform();
    let scripts = document.getElementsByTagName('script');

    for (let script of scripts) {
        if (script.innerHTML.length > 1 && script.getAttribute('reload') == 'yes')
            eval(script.innerHTML);

        else if (script.getAttribute('reload') == 'yes' && script.src)
            ajax(null, script.src, code => eval(code));
    }
    for (let script of scripts)
        script.outerHTML = '';
};

const vForm = data => {};

const appndToBody = str => {
    if (!str) str = '';

    str = new DOMParser().parseFromString(str, "text/html");
    document.body.innerHTML = str.body ? str.body.innerHTML : str;
};

const elIndex = (el = '') => {

    var pn = document.querySelector(el).parentNode;
    var n_xs = Array.prototype.slice.call(pn.children),
        l_xn = document.getElementById(el);

    return n_xs.indexOf(l_xn);
};