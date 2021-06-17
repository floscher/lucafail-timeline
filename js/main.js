(function(){
    var typeFriendlyNames = {
        "general": "Allgemein",
        "doc": "Dokument/Paper/Veröffentlichung",
        "fragdenstaat": "Anfrage via fragdenstaat.de",
        "incident": "Schwachstelle/Sicherheitsproblem",
        "news": "Veröffentlichungen in Magazinen, Newsportalen, ...",
        "event": "Veranstaltung",
        "broadcast": "TV- oder Radiosendung",
        "talk": "Präsentation auf Fachveranstaltung"
    };
    var fdsbuttonclickhandler = (e) => {
        var fdsclosest = $(e.target).closest("[data-fds-id]");
        if (fdsclosest.length){
            var fds = fdsclosest.data("fds-id");
            if (fds){
                window.open('https://fragdenstaat.de/a/' + fds, '_blank');
            }
        }
    };
    var glbuttonclickhandler = (e) => {
        var glclosest = $(e.target).closest("[data-gl-url]");
        if (glclosest.length){
            var url = glclosest.data("gl-url");
            if (url){
                window.open(url, '_blank');
            }
        }
    };

    /**
     * EMBEDDING of (external) content
     */
    var embedTypes = {
        "iframe": {
            // false = directly loaded / true = only loaded with consent
            needsConsent: true,
            // type could iframe or widget
            type: "iframe",
            // function called if consent given and content should be embedded
            embed: ($container, cfg) => {
                // true for successfull embed, false for fail
                if (typeof cfg.url != "undefined"){
                    var $iframe = $("<iframe>")
                                .attr("src", cfg.url)
                                .attr("frameborder", "0")
                                .css("width","100%")
                                .attr("scrolling","no");
                    if (cfg.height){
                        $iframe.css("height", cfg.height);
                    } else {
                        $iframe.css("min-height", "320px");
                    }
                    $container.append($iframe);
                    return true; 
                }
                return false; 
            }
        },
        "fragdenstaat": {
            needsConsent: false,
            type: "widget",
            provider: {
                name: "Open Knowledge Foundation Deutschland e.V.",
                address: "Singerstr. 109, 10179 Berlin",
                url: "https://fragdenstaat.de/",
                dataprivacynotice_url: "https://fragdenstaat.de/datenschutzerklaerung/"
            },
            embed: ($container, cfg) => {
                if (typeof cfg.id != "undefined"){
                    var $fragdenstaat = $("<div>").attr("data-fds-id", cfg.id);
                    
                    // TODO: Integrate embedFDS() here? 
                    embedFDS($fragdenstaat);

                    $container.append($fragdenstaat);
                    return true; 
                }
                return false; 
            }
        },
        "vimeo": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg && typeof cfg.id !== "undefined"){
                    var $iframe = $("<iframe>")
                                .attr("src", "https://player.vimeo.com/video/" + cfg.id)
                                .attr("allowfullscreen","")
                                .attr("frameborder", "0")
                                .css("width","100%")
                                .css("min-height", "320px");
                    $container.append($iframe);
                    return true;
                }
                return false; 
            }
        },
        "youtube": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg && typeof cfg.id !== "undefined"){
                    var $iframe = $("<iframe>")
                                    .attr("src", "https://www.youtube-nocookie.com/embed/" + cfg.id)
                                    .attr("allowfullscreen","")
                                    .attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
                                    .attr("frameborder", "0")
                                    .css("width","100%")
                                    .css("min-height", "320px");
                    $container.append($iframe);
                    return true;
                }
                return false; 
            }
        },
        "tweet": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg.url){
                    var $tweetdiv = $("<div>");
                    // TODO: we can do that better... (twttr.widgets.createTweet ?)
                    // https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference
                    $tweetdiv.html("\u003Cblockquote data-dnt=\"true\" data-theme=\"dark\" data-align=\"center\" class=\"twitter-tweet\"\u003E\u003Ca href=\""+cfg.url+"\"\u003E\u003C\/a\u003E\u003C\/blockquote\u003E\n\u003Cscript async src=\"https:\/\/platform.twitter.com\/widgets.js\" charset=\"utf-8\"\u003E\u003C\/script\u003E");
                    $container.append($tweetdiv);
                }
            }
        },
        "ardmediathek": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg.id){
                    var url = "https://www.ardmediathek.de/embed/" + cfg.id; 
                    if (cfg.startTime && cfg.endTime){
                        url += "?startTime="+cfg.startTime+"&endTime="+cfg.endTime;
                    }
                    var $iframe = $("<iframe>")
                                    .attr("src", url)
                                    .attr("allowfullscreen","")
                                    .attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
                                    .attr("frameborder", "0")
                                    .css("width", "100%")
                                    .css("min-height", "320px");// .css("width","640").css("height","420");
                    $container.append($iframe);
                    return true; 
                }
                return false; 
            }
        },
        "ccc-media": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg.id){
                    var $iframe = $("<iframe>")
                                    .attr("src", "https://media.ccc.de/v/"+cfg.id+"/oembed")
                                    .attr("allowfullscreen","")
                                    .attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
                                    .attr("frameborder", "0")
                                    .css("width","100%")
                                    .css("min-height", "320px");
                    $container.append($iframe);

                    return true; 
                }
                return false; 
            }
        },
        "podlove": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg.id){
                    var $iframe = $("<iframe>")
                                    .attr("src", "https://cdn.podlove.org/web-player/share.html?episode="+cfg.id)
                                    .attr("width","600")
                                    .attr("height","230")
                                    .attr("scrolling","no")
                                    .attr("frameborder", "0")
                                    .addClass("podlove");
                    $container.append($iframe);

                    return true; 
                }
                return false; 
            }
        },
        "gitlab": {
            // TODO: Check how to prevent external images from loading
            needsConsent: false,
            type: "widget",
            embed: ($container, cfg) => {
                if (cfg.project && cfg.issue){
                    var $gldiv = $("<div>").attr("data-gl-project-id", cfg.project).attr("data-gl-issue-id", cfg.issue);
                    embedGL($gldiv);
                    $container.append($gldiv);

                    return true; 
                }
                return false; 
            }
        }
    };
    var syncConsentToContent = () => {
        var consentGiven = $("#checkboxExternalContent").is(":checked");

        console.log("syncConsentToContent", $(".embed[data-embed-cfg]").length);

        $(".embed[data-embed-cfg]").each((i, e) => {
            var $container = $(e); 
            var cfg = {};
            try {
                var rawcfg = $container.data("embed-cfg");
                if (typeof rawcfg == "object"){
                    cfg = rawcfg; 
                } else {
                    cfg = JSON.parse(rawcfg);
                }
                
            } catch (e){};

            var currentState = false;
            if ($container.data("embed-consent-state") && $container.data("embed-consent-state") == "true"){
                currentState = true; 
            }

            // lookup embed type configuration
            var embedcfg = null;
            if (cfg.type && typeof embedTypes[cfg.type] != "undefined"){
                embedcfg = embedTypes[cfg.type];
            }

            if (!embedcfg){
                console.log("No embed type '" + cfg.type + "' found!");
            } else {
                var consentForThisEmbed = consentGiven || !embedcfg.needsConsent; 

                if (currentState != consentGiven || !$container.data("embed-consent-state")){
                    $container.html(""); 

                    if (consentForThisEmbed){
                        // consent given, call callbacks
                        var res = false; 
                        if (typeof embedcfg.embed == "function"){
                            res = embedcfg.embed($container, cfg);
                        }

                        if (!res){
                            console.log("[ERROR] Container couldn't rendered/embedded.", embedcfg, cfg);
                        }

                        $container.attr("data-embed-consent-state", "true");
                    } else {
                        // no consent, hide content, show placeholder
                        var $embedPlaceholderInner = $("<div>").addClass("embed-placeholder").html('Um diesen Inhalt eines externen Anbieters ('+cfg.type+') zu laden, benötigen wir Ihr Einverständnis. Bitte beachten Sie dazu die <a href="#datenschutz">Datenschutzerklärung</a> unten.<br>');
                        var $btn_consent = $("<button>").text("Einverständnis erteilen").on("click", () => {
                            $('#checkboxExternalContent').click();
                        });
                        $embedPlaceholderInner.append($btn_consent);

                        $container.append($embedPlaceholderInner);
                        $container.attr("data-embed-consent-state", "false");
                    }
                }
            }
            
        });
    };
    $("#checkboxExternalContent").on("change", syncConsentToContent);

    var embedFDS = ($fdswidget) => {
        $fdswidget.addClass("fds-widget").addClass("embed-widget");
        $.ajax({
            url: "/api/fds.php",
            data: { id: $fdswidget.data("fds-id") },
            dataType: 'json',
            success: (data) => {
                if (data.data){
                    data = data.data;
                    var $fdstitle = $("<div>").addClass("fds-title").text(data.title);
                    $fdswidget.append($fdstitle);

                    var $fdscontent = $("<div>").addClass("fds-content");

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Anfrage an:<br>"));
                    $fdscontent.append($("<span>").text(data.recipient));

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Status:<br>"));
                    $fdscontent.append($("<span>").addClass("fds-status-badge").addClass("fds-status-" + data.status).text(data.status));
                    $fdscontent.append($("<span>").text(" - " + data.resolution + " (" + data.messages_count + " Nachrichten)"));

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Letzte Nachricht:<br>"));
                    $fdscontent.append($("<span>").text(data.last_message));

                    if (data.costs){
                        $fdscontent.append($("<span>").addClass("fds-content-title").html("Kosten:<br>"));
                        $fdscontent.append($("<span>").text(data.costs + " €"));
                    }

                    if (data.summary){
                        $fdscontent.append($("<span>").addClass("fds-content-title").html("Zusammenfassung / Fazit:<br>"));
                        $fdscontent.append($("<span>").text(data.summary));
                    }

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Inhalt:<br>"));
                    // TODO: Find a better way than throwing unchecked HTML into the page...
                    $fdscontent.append($("<span>").html(data.description));

                    $fdscredit = $("<div>").addClass("fds-credit");
                    $tr = $("<tr>");
                    $td = $("<td>").append($("<img>").attr("src","/assets/fds/banner.svg").css("max-height","50px").css("margin-right","10px"));
                    $tr.append($td);

                    $td = $("<td>");
                    $td.append($("<span>").html("Die in diesem Widget angezeigten Daten werden von <a href=\"https://fragdenstaat.de\" target=\"_blank\">fragdenstaat.de</a> abgerufen."));
                    $td.append($("<button>").text("Zur Original-Anfrage auf fragdenstaat.de »").on("click", fdsbuttonclickhandler));
                    $tr.append($td);

                    $fdscredit.append($("<table>").append($tr));
                    $fdscontent.append($fdscredit);

                    $fdswidget.append($fdscontent);
                }
            }
        });
    }
    var embedGL = ($glwidget) => {
        $glwidget.addClass("gl-widget").addClass("embed-widget");
        $.ajax({
            url: "/api/gitlab.php",
            data: { project: $glwidget.data("gl-project-id"), issue: $glwidget.data("gl-issue-id") },
            dataType: 'json',
            success: (data) => {
                if (data.data){
                    data = data.data;
                    var $gltitle = $("<div>").addClass("gl-title").text("Gitlab: " + data.title);
                    $glwidget.append($gltitle);

                    var $glcontent = $("<div>").addClass("gl-content");

                    $glcontent.append($("<span>").addClass("gl-content-title").html("Author:<br>"));
                    $glcontent.append($("<span>").text(data.author.name));

                    $glcontent.append($("<span>").addClass("gl-content-title").html("State:<br>"));
                    $glcontent.append($("<span>").text(data.state));

                    $glcontent.append($("<span>").addClass("gl-content-title").html("Letztes Update:<br>"));
                    $glcontent.append($("<span>").text(data.updated));

                    $glcontent.append($("<span>").addClass("gl-content-title").html("Inhalt:<br>"));

                    // TODO: Find a better way than throwing unchecked HTML into the page...
                    var md = window.markdownit({
                        html: true, 
                        breaks: true, 
                        linkify: true
                    });
                    var md_rendered = md.render(data.description);
                    if (md_rendered){
                        $rendered = $(md_rendered);
                        $rendered.find("img").each((i, e) => {
                            if ($(e).attr("src").match(/^\/uploads\/.+/i)){
                                $(e).attr("src", data.url.split("/").slice(0,5).join("/") + $(e).attr("src"));
                            }
                        });
                        $rendered.find("a").each((i, e) => {
                            $(e).attr("target", "_blank"); 
                        });
                        
                        $glcontent.append($("<span>").addClass("gl-content-gltext").html($rendered));
                    } else {
                        $glcontent.append($("<span>").html(data.description));
                    }

                    $glwidget.attr("data-gl-url", data.url);

                    $glcredit = $("<div>").addClass("gl-credit");
                    $tr = $("<tr>");

                    $td = $("<td>").append($("<img>").attr("src","/assets/gitlab-logo-gray-stacked-rgb.svg").css("width", "100%").css("max-height","65px").css("margin-right","10px"));
                    $tr.append($td);

                    $td = $("<td>");
                    $td.append($("<span>").html("Die in diesem Widget angezeigten Daten werden von <a href=\"https://gitlab.com\" target=\"_blank\">gitlab.com</a> abgerufen."));
                    $td.append($("<button>").text("Zur Original-Anfrage auf gitlab.com »").on("click", glbuttonclickhandler));
                    $tr.append($td);

                    $glcredit.append($("<table>").append($tr));
                    $glcontent.append($glcredit);

                    $glwidget.append($glcontent);
                }
            }
        });
    }
    $.ajax({
        url: "/data/timeline_data.json",
        dataType: 'json',
        success: (data) => {
            data.timeline.push({
                title: "Ausblick / Roadmap dieser Seite",
                text: "Siehe <a href=\"https://github.com/wasserbombe/lucafail-timeline\" target=\"_blank\">https://github.com/wasserbombe/lucafail-timeline</a>"
            });
            var lastYearAndMonth = null; 
            var statisticsByMonthAndCategory = {};
            data.timeline.forEach((e, i) => {
                if (e.date){
                    var dateMatch = e.date.match(/^[0-9]{2}\.([0-9]{2})\.([0-9]{4})$/i);
                    if (dateMatch){
                        var yearMonth = dateMatch[2] + '-' + dateMatch[1];
                        if (yearMonth != lastYearAndMonth){
                            // new month!
                            var $monthSep = $("<div>").html("<h2>" + yearMonth + "</h2>").addClass("month-separator").attr("id", yearMonth);

                            $(".timeline").append($monthSep);


                            lastYearAndMonth = yearMonth; 
                        }
                    }
                }
                
                $div = $("<div>").addClass("container").addClass((i%2 == 0)?"left":"right");

                e.tags = e.tags || []; 
                var subtitle = [];
                subtitle.push(e.date);
                if (e.scope) subtitle.push(e.scope);
                if (e.type){
                    $div.addClass("type-" + e.type);
                    subtitle.push(e.type);
                    e.tags.push(e.type);
                } else {
                    $div.addClass("type-general");
                    e.type = "general";
                }

                $("#filterTopics").append($("<option>").text(e.type));

                if (typeof statisticsByMonthAndCategory[lastYearAndMonth] == "undefined") statisticsByMonthAndCategory[lastYearAndMonth] = {};
                if (typeof statisticsByMonthAndCategory[lastYearAndMonth][e.type] == "undefined"){
                    statisticsByMonthAndCategory[lastYearAndMonth][e.type] = 1;
                } else {
                    statisticsByMonthAndCategory[lastYearAndMonth][e.type]++;
                }

                $content = $("<div>").addClass("content");

                $subtitle = $("<span>").addClass("subtitle").html(subtitle.join(' / '));
                $content.append($subtitle);

                $title = $("<h2>").addClass("title").html(e.title);
                $content.append($title);

                if (e.text){
                    $text = $("<div>").html(e.text);
                    $content.append($text);                    
                }

                // new consent-based embed
                if (e.embed && e.embed.length){
                    e.embed.forEach((embed, i) => {
                        var $embedPlaceholderDiv = $("<div>").addClass("embed").attr("data-embed-cfg", JSON.stringify(embed));
                        $content.append($embedPlaceholderDiv);
                    });
                }

                // linklist
                if (e.links && e.links.length){
                    $linklist = $("<ul>");
                    e.links.forEach((link,i) => {
                        $li = $("<li>");
                        $a = $("<a>").attr("href", link.url).attr("title", "Externer Link: "+link.text).attr("target", "_blank").text(link.text);
                        $li.append($a);
                        $linklist.append($li);
                    });
                    
                    $linkarea = $("<div>").addClass("linkarea").html('<b>Weiterführende Links:</b>').append($linklist);

                    $content.append($linkarea);                    
                }

                // tag list
                $tags = $("<div>").addClass("tagarea"); 
                e.tags.forEach((e, i) => {
                    $tag = $("<span>").addClass("tag").text(e).attr("data-tag", e.toLowerCase());
                    $tags.append($tag);
                });
                $content.append($tags);

                $div.append($content);

                $(".timeline").append($div);
            });

            syncConsentToContent();

            console.log(statisticsByMonthAndCategory);
            var series = {"name": "test", data: []}; 
            var series = {}; 
            for (var m in statisticsByMonthAndCategory){
                if (m && statisticsByMonthAndCategory.hasOwnProperty(m)){
                    var ts = new Date(m).getTime(); 
                    for (var c in statisticsByMonthAndCategory[m]){
                        if (c && statisticsByMonthAndCategory[m].hasOwnProperty(c)){
                            // series.data.push([ts, statisticsByMonthAndCategory[m][c]]);
                            if (typeof series[c] == "undefined") series[c] = []; 
                            series[c].push([ts, statisticsByMonthAndCategory[m][c]]);
                        }
                    }
                }
            }
            var series_new = []; 
            for (var c in series){
                if (c && series.hasOwnProperty(c)){
                    var name = c; 
                    if (typeof typeFriendlyNames[name] != "undefined"){
                        name = typeFriendlyNames[name]; 
                    }
                    series_new.push({ name: name, data: series[c] });
                }
            }
            
            Highcharts.chart('stats_container_month_category', {
                chart: {
                    type: 'column'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Beiträge in dieser Timeline - pro Monat'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Beiträge'
                    }
                },
                legend: {
                    enabled: true
                },
                tooltip: {},
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: series_new
            });
        }
    });

    /**
     * STATS
     */
    // stats_container_tweets_per_day
    $.ajax({
        url: "/api/stats.php",
        dataType: 'json',
        data: { view: 'twt_tweets-per-day' },
        success: (data) => {
            console.log(data); 
            if (data.data){
                data = data.data; 
                var series_tweets = {
                    name: 'Tweets', 
                    data: []
                }; 
                var series_tweets_per_user = {
                    name: 'Tweets pro Nutzer', 
                    data: [],
                    type: 'line',
                    yAxis: 1
                }; 
                data.forEach((e, i) => {
                    series_tweets.data.push([new Date(e.date).getTime(), e.tweets]);
                    series_tweets_per_user.data.push([new Date(e.date).getTime(), e.tweets_per_user]);
                });
                console.log(series_tweets); 

                Highcharts.chart('stats_container_tweets_per_day', {
                    chart: {
                        type: 'column'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Tweets pro Tag zum Thema'
                    },
                    xAxis: {
                        type: 'datetime',
                        min: Date.UTC(2020, 0, 1),
                    },
                    yAxis: [{
                        min: 0,
                        title: {
                            text: 'Tweets'
                        }
                    },{
                        min: 1,
                        title: {
                            text: ''
                        },
                        opposite: true
                    }],
                    legend: {
                        enabled: false
                    },
                    tooltip: {},
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                //enabled: true
                            }
                        }
                    },
                    series: [
                        series_tweets
                        //series_tweets_per_user
                    ]
                });
            }
        }
    });

    // stats_container_hashtags
    $.ajax({
        url: "/api/stats.php",
        dataType: 'json',
        data: { view: 'twt_hashtags' },
        success: (data) => {
            console.log(data); 
            if (data.data){
                data = data.data; 
                var series = { name: 'Hashtag', type: 'wordcloud', data: []};
                var c = 0; 
                data.forEach((e, i) => {
                    if (
                        //c < 25 && 
                        e.tweets > 2 &&
                        ['lucaapp','lucafail'].indexOf(e.hashtag.toLowerCase()) == -1){
                        series.data.push({ name: '#' + e.hashtag, weight: e.tweets });
                        c++; 
                    }
                    
                });

                Highcharts.chart('stats_container_hashtags', {
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Häufig genutzte Hashtags'
                    },
                    series: [
                        series
                    ]
                });
            }
        }
    });

    // stats_container_domains
    $.ajax({
        url: "/api/stats.php",
        dataType: 'json',
        data: { view: 'twt_domains' },
        success: (data) => {
            console.log(data); 
            if (data.data){
                data = data.data; 
                var series = { name: 'Domains', type: 'wordcloud', data: []};
                var c = 0; 
                data.forEach((e, i) => {
                    if (e.tweets > 2 && ["swarmapp.com","4sq.com"].indexOf(e.domain.toLowerCase()) == -1){
                        series.data.push({ name: e.domain, weight: e.tweets });
                        c++; 
                    }
                    
                });

                Highcharts.chart('stats_container_domains', {
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Häufig verlinkte Domains'
                    },
                    series: [
                        series
                    ]
                });
            }
        }
    });
})(); 