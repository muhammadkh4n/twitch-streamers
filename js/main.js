document.addEventListener("DOMContentLoaded", init);

// Initialize after document loads.
function init(event) {

  var client = "?client_id=8an0nvpc9w85vvwi18evnz95yixdg";
  var twitch = "https://api.twitch.tv/kraken" + client;
  var twitchTv = "https://www.twitch.tv/";
  var feat = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
  var featStreams = [];

  // find element in DOM by query.
  var $ = function (query) {
    return document.querySelector(query);
  };

  // fetch json data via ajax
  var fetchLinks = function (url) {
    $_AJAX.get(url, function (response) {
      if (response._links) {
        processLinks(response._links);
      }
    });
  };

  // process fetched links.
  var processLinks = function (links) {
    getStreams(links.streams);
    getFeatStreams(links.streams);
  };

  // get top 25 streams data specified in url.
  var getStreams = function (url) {
    url += client;
    $_AJAX.get(url, function (streamData) {
      processStreams(streamData.streams);
    });
  };

  // get featured streams, specified in feat array.
  var getFeatStreams = function (streamsUrl) {
    var featUrls = feat.map(function (val) { // generate urls with channel and client id.
      return streamsUrl + "/" + val + client;
    });
    getChannel(featUrls, 0);
  };

  // get a channel data. recursive algorithm. ajax to sjax :p
  var getChannel = function (urlArray, i) {
    if (i > urlArray.length - 1) return processStreams(featStreams, true);

    $_AJAX.get(urlArray[i], function (data) {
      if (!data.stream && !data.error) { // offline
        $_AJAX.get(data._links.channel + client, function (response) {
          featStreams.push(response);
          return getChannel(urlArray, i+1);
        });
      } else {
        featStreams.push(data);
        return getChannel(urlArray, i+1);
      }
    });
  };

  // feat streams array display / render.
  var processStreams = function (streams, featured) {
    var processed = [];
    for (var i = 0; i < streams.length; i++) {
      var s = streams[i].stream ? streams[i].stream : streams[i];
      if (s.error) { // not found
        var display_name = s.message.match(/'(.+)'/);
        if (display_name[1]) {
          display_name = display_name[1];
        } else {
          display_name = s.message;
        }
        processed.push({
          status: 404,
          name: display_name,
          title: "Not Found"
        });
      } else if (!s.viewers) { // Offline
        processed.push({
          status: 204,
          name: s.display_name,
          title: "Offline",
          logo: s.logo,
          url: s.url
        });
      } else {
        processed.push({ // online
          status: 200,
          game: s.game,
          preview: s.preview.medium,
          viewers: s.viewers,
          name: s.channel.display_name,
          title: s.channel.status,
          logo: s.channel.logo,
          url: s.channel.url
        });
      }
    }

    console.log(processed);
    renderStreams(processed, featured);
  };

  // render processed stream data
  var renderStreams = function (processedStreams, featured) {
    if (featured)
      buildFeaturedHtml(processedStreams);
    else
      buildTopStreamsHtml(processedStreams);
  };

  // build html for featured streams
  var buildFeaturedHtml = function (data) {
    renderData(data, "featured");
  };

  // build top streams html.
  var buildTopStreamsHtml = function (data) {
    renderData(data, "top-25");
  };

  // render data in view of elemId.
  var renderData = function (data, elemId) {
    var html = genHtml(data);
    $("#" + elemId).innerHTML = html;
  };

  // generate results html.
  var genHtml = function (data) {
    var html =  "<table class='streams'>";
        html += "<thead><tr><td>Status</td><td>Logo</td><td>Preview</td><td>Name</td><td>Title</td><td>Game</td></tr></thead>";
    for (var i = 0; i < data.length; i++) {
      html += genItemHtml(data[i]);
    }
    html += "</table>";
    return html;
  };

  // generate a signle item / stream html.
  var genItemHtml = function (item) {
    var html = "<tr class='stream'>";
        // case stream status
        switch (item.status) {
          case 404:
            html += "<td class='not-found status'><i class='fa fa-times'></i></td>";
            break;
          case 204:
            html += "<td class='offline status'><i class='fa fa-circle'></i></td>";
            break;
          default:
            html += "<td class='online status'><i class='fa fa-circle'></i></td>";
        }

        if (item.logo) {
          html += "<td class='logo'><img src='" + item.logo + "'></td>";
        } else {
          html += "<td></td>";
        }

        if (item.preview) {
          html += "<td class='preview'><img src='" + item.preview + "'></td>";
        } else {
          html += "<td></td>";
        }

        if (item.url) {
          html += "<td class='name'><a target='_blank' href='" + item.url + "'>" + item.name + "</a></td>";
        } else {
          html += "<td class='name'>" + item.name + "</td>";
        }

        html += "<td class='title'>" + item.title + "</td>";

        if (item.game && item.viewers) {
          html += "<td class='meta'><span class='game'>" + item.game +
                  "</span><span class='viewers'>Viewers: " + item.viewers + "</span></td>";
        } else {
          html += "<td></td>";
        }

        html += "</tr>";

    return html;
  };

  fetchLinks(twitch);

}
