(function() {

  /*
   * URL Redirect v1.3
   *
   * Author: Brunello - Kyle Langford
   *
   * 1. Adds utm_ and el_ params to form redirect
   * 2. Adds certain params to form submission
   * 3. Adds utm params to links directing to lexialearning.com
   *
   * Updates:
   * UTM Form Submision (Start)
   * updated scripts on an Eloqua test page to allow for all landing page URLs to automatically pull UTMs 
   * Checking to see if form field exists
   *
   *
   */

  const url_redirect = 'https://www.lexialearning.com/company/'; 

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  // Get params
  const params = getUrlParams();
  
  const param_aid = params.get('aid'); 
  const param_ar = params.get('ar'); 
  const param_cid = params.get('cid'); 
  const param_lsd = params.get('lsd'); 
  const param_utm_source = params.get("utm_source"); // returns null if not found
  const param_utm_medium = params.get("utm_medium");
  const param_utm_campaign = params.get("utm_campaign");
  const param_utm_content = params.get("utm_content");
  const param_utm_term = params.get("utm_term");
  const param_debug = params.get("debug");

  // Input elements, defined in Eloqua form
  const field_aid = document.querySelector('[name="aid"]'); 
  const field_ar = document.querySelector('[name="ar"]'); 
  const field_cid = document.querySelector('[name="cid"]'); 
  const field_lsd = document.querySelector('[name="lsd"]'); 
  const field_utm_source = document.querySelector('[name="utm_source"]');
  const field_utm_medium = document.querySelector('[name="utm_medium"]');
  const field_utm_campaign = document.querySelector('[name="utm_campaign"]');
  const field_utm_content = document.querySelector('[name="utm_content"]');
  const field_utm_term = document.querySelector('[name="utm_term"]');
  const field_redirect = document.querySelector('[name="redirect"]');

  // Appended to redirect
  const utm_params = isParamUtm(params); // Use only UTM Params
  const utm_redirect = utm_params.join('&'); // Create String from UTM Params
  const debug = (param_debug === 'true') ? true : false;
  const links = document.querySelectorAll('a');

  // Check before replacing
  if (!!url_redirect && field_redirect) {
    field_redirect.value = url_redirect;
  }
  
  // If utm params exist
  if (!!utm_redirect) {

    if (typeof param_utm_source !== "undefined" && field_utm_source) {
      field_utm_source.value = param_utm_source;
    }

    if (typeof param_utm_medium !== "undefined" && field_utm_medium) {
      field_utm_medium.value = param_utm_medium;
    }

    if (typeof param_utm_campaign !== "undefined" && field_utm_campaign) {
      field_utm_campaign.value = param_utm_campaign;
    }

    if (typeof param_utm_content !== "undefined" && field_utm_content) {
      field_utm_content.value = param_utm_content;
    }

    if (typeof param_utm_term !== "undefined" && field_utm_term) {
      field_utm_term.value = param_utm_term;
    }

    // Add utm string to redirect url
    if (field_redirect) { 
      field_redirect.value += '?' + utm_redirect;
    }
  }

  // Additional params
  if (typeof param_cid !== "undefined" && field_cid) {
    field_cid.value = param_cid;
  }

  if (typeof param_aid !== "undefined" && field_aid) {
    field_aid.value = param_aid;
  }

  if (typeof param_lsd !== "undefined" && field_lsd) {
    field_lsd.value = param_lsd;
  }

  if (typeof param_ar !== "undefined" && field_ar) {
    field_ar.value = param_ar;
  }

  // Add UTM to outgoing links. 
  if (links) {

    links.forEach(function(link) {
      const href = link.href;
      const hostname = new URL(href);
      const queryString = window.location.search;
      const symbol = queryString ? '&' : '?';
      const cid = param_cid ? '&cid=' + param_cid : '';

      // if hostname equals lexialearning.com then add utm code. 
      if (hostname.hostname.includes('lexialearning.com')) {
        link.href = href + symbol + utm_redirect + cid ;   
        if (debug) { console.log(link.href); }
      }

    });
  }


  // Debug
  if (debug) {
    console.log('Params', params);      
    console.log('UTM', utm_params);   
    console.log('Redirect', field_redirect.value);      
  }

  // Parse search params, returns an array
  function getUrlParams() {
    let paramMap = new Map();

    if (location.search.length == 0) {
      return paramMap;
    }

    const parts = location.search.substring(1).split("&");

    for (let i = 0; i < parts.length; i ++) {
      const component = parts[i].split("=");
      paramMap.set(decodeURIComponent(component[0]), decodeURIComponent(component[1]));
    }

    return paramMap;
  }

  // Check if a param is a utm_
  function isParamUtm(search_params) {
    let utm = [];

    search_params.forEach(function(value, key) {
      if (key.startsWith('utm_') || key === 'eq'  ) {
        utm.push(key+'='+value);
      }
    })

    return utm;
  }

})();