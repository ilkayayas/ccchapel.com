﻿//************************************************
// SEARCH
//***********************************************/
(function (CCChapel, $, undefined) {
    //************************************************
    // Public Properties
    //***********************************************/

    /************************************************
    // Private Properties
    //***********************************************/
    var apiUrl = location.protocol + "//" + location.hostname + "/api/search/";
    var defaults = {
        maxResults: undefined
    }
    var itemClass = ".menu__search";
    var fieldClass = ".menu__search-field";
    var searchField = "#menu-search";
    var iconClass = ".menu__search-icon";
    var bannerClass = ".banner";

    var query;

    /************************************************
    // Public Methods
    //***********************************************/
    CCChapel.getSearchResults = function(query, options) {
        var url = apiUrl + encodeURI(query);

        options = $.extend({}, defaults, options);

        if (options.maxResults !== undefined) {
            url += "?maxResults=" + options.maxResults;
        }
        return $.getJSON(url);
    }

    CCChapel.openSearch = function () {
        if (CCChapel.isMobile() == true) {
            CCChapel.openMobileMenu();
        }
        else {
            $(iconClass).click();
        }
    }

    CCChapel.clearSearchResults = function () {
        $(".search-results").html("");
    }

    CCChapel.initializeSearch = function () {
        $(document).ready(function () {
            initializeAjaxSearch();

            //Setup Enter to Load Search Page
            $(searchField).keyup(function (e) {
                if (e.keyCode == 13) {
                    query = $(searchField).val();

                    if (query.length > 0) {
                        window.location = getQueryLink(query);
                    }
                }
            });
        });
    }

    //************************************************
    // Private Methods
    //***********************************************/
    function initializeAjaxSearch() {
        var timer;
        var delay = 600;
        var loading = false;
        var hasFocus = false;

        $(searchField).on('focus', function () {
            if (hasFocus === false) {
                CCChapel.hideMenuItems({ duration: 250 });
            }

            if ($(searchField).val().length <= 0) {
                showInstructions();
            }

            hasFocus = true;
        });

        $(searchField).on('blur', function () {
            hasFocus = false;

            setTimeout(function () {
                if (hasFocus === false) {
                    //Only show the Menu Items if the Search is empty
                    if ($(searchField).val().length <= 0) {
                        CCChapel.clearSearchResults();

                        CCChapel.showMenuItems({ duration: 250 });
                    }
                }
            }, 500);
        });

        //Setup AJAX Results
        $(searchField).on('input', function () {
            if (CCChapel.isMobile() != true) {
                if (loading == false) {
                    showLoading();

                    loading = true;
                }

                window.clearTimeout(timer);

                timer = window.setTimeout(function () {
                    query = $(searchField).val();

                    if (query.length > 0) {
                        var jqxhr = CCChapel.getSearchResults(query);

                        jqxhr.done(function (data) {
                            loading = false;

                            if (data.totalItemCount > 0) {
                                displaySearchResults(data);
                            }
                            else {
                                displayNoResults();
                                //console.log(data);
                            }
                        })
                        .fail(function (jqxhr, textStatus, error) {
                            loading = false;

                            var err = textStatus + ", " + error;
                            console.log("Request Failed: " + err);

                            //displayNoResults();
                            displayPressEnter();
                        });
                    }
                    else {
                        loading = false;

                        showInstructions();
                    }
                }, delay);
            }
        });
    }

    function showInstructions() {
        CCChapel.clearSearchResults();

        var html = $("<div></div>").addClass("search-results");
        var contentWrapper = $("<div></div>").addClass("content-wrapper");

        var instructions = $("<div></div>").html("What can we help you find?");

        var sectionTitle =
                $("<div></div>")
                    .addClass("section-title font-white")
                    .append(instructions);

        contentWrapper.append(sectionTitle);
        html.append(contentWrapper);
        $(".search-results").append(html);
    } 

    function showLoading() {
        CCChapel.clearSearchResults();

        var html = $("<div></div>").addClass("search-results");
        var contentWrapper = $("<div></div>").addClass("content-wrapper");

        var searching = $("<div></div>").html("<i class='fa fa-circle-o-notch fa-spin'></i> Searching&hellip;");

        //var spinnerContainer = $("<div></div>");
        //var spinner = $("<i></i>").addClass("fa fa-circle-o-notch fa-spin fa-2x");
        //spinnerContainer.append(spinner);

        var sectionTitle =
            $("<div></div>")
                .addClass("section-title font-white")
                .append(searching);
                //.append(spinner);;;

        contentWrapper.append(sectionTitle);
        html.append(contentWrapper);
        $(".search-results").append(html);
    }

    function getQueryLink(query) {
        return "/search?query=" + encodeURI(query.replace(" ", "+"));
    }

    function displayNoResults() {
        //Clear out old results
        CCChapel.clearSearchResults();

        var html = $("<div></div>").addClass("search-results");
        var contentWrapper = $("<div></div>").addClass("content-wrapper");

        var sectionTitle =
            $("<div></div>")
                .addClass("section-title font-white")
                .html("Hmm&hellip; We didn&rsquo;t find anything for <i>" + query + "</i>");
        contentWrapper.append(sectionTitle);

        var sectionDescription =
            $("<div></div>")
                .addClass("section-description font-white")
                .html('Maybe try searching for something else, ' +
                      'browse our <a class="font-white" href="https://communitychapel.ccbchurch.com/w_group_list.php">groups</a> ' +
                      'and <a class="font-white" href="/events#all-events">events</a> ' +
                      'or feel free to <a class="font-white" href="/contact-us">contact us directly</a>.');
        contentWrapper.append(sectionDescription);

        html.append(contentWrapper);
        $(".search-results").append(html);
    }

    function displayPressEnter() {
        //Clear out old results
        CCChapel.clearSearchResults();

        var html = $("<div></div>").addClass("search-results");
        var contentWrapper = $("<div></div>").addClass("content-wrapper");

        var sectionTitle =
            $("<div></div>")
                .addClass("section-title font-white")
                .html("Press Enter");
        contentWrapper.append(sectionTitle);

        html.append(contentWrapper);
        $(".search-results").append(html);
    }

    function displaySearchResults(results) {
        //Clear out old results
        CCChapel.clearSearchResults();

        //var html = $("<div></div>").addClass("search-results");
        var contentWrapper = $("<div></div>").addClass("content-wrapper no-vertical");

        $.each(results.items, function (i, item) {
            var result = $("<div></div>").addClass("search-results__item");

            var link = $("<a></a>").attr("href", item.url);
            var title = $("<div></div>").addClass("search-results__item-title").html(item.title);
            var description = $("<div></div>").addClass("search-results__item-description").html(item.description);
            link.append(title, description);

            var horizontalRule = $("<hr />");

            result.append(link);
            contentWrapper.append(result.add(horizontalRule));
        });

        if (results.totalItemCount > 3) {
            var more = $("<div></div>").addClass("center");
            var moreLink = $("<a></a>").addClass("cta auto red").attr("href", getQueryLink(results.query)).html('More Results&nbsp;<i class="fa fa-chevron-right"></i>');

            more.append(moreLink);
            contentWrapper.append(more);
        }
        else {
            //Add link to Group Finder & Events
            /*
            <div class="section-description">
                Didn&rsquo;t find what you were looking for? 
                See a full list of <a href="https://communitychapel.ccbchurch.com/w_group_list.php">groups</a> or <a href="/events#all-events">events</a>. 
            </div>
            */
            var links = $("<div></div>").addClass("section-description font-white");
            var linksHtml = 'Didn&rsquo;t find what you were looking for? ' +
                            'See a full list of <a class="font-white" href="/groups">groups</a> ' +
                            'and <a class="font-white" href="/events#all-events">events</a>.';
            
            links.append(linksHtml);
            contentWrapper.append(links);
        }

        //html.append(contentWrapper);
        //$(".search-results").append(html);
        $(".search-results").append(contentWrapper);

        ////Clean Up
        //while ($(window).height() < $(".search-results").outerHeight()) {
        //    $(".search-results .search-results__item").last().remove();
        //    $(".search-results .search-results").children(".content-wrapper").children("hr").last().remove();
        //}
    }
}(window.CCChapel = window.CCChapel || {}, jQuery));



