chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  console.log("Received %o from %o, frame", request, sender.tab, sender.frameId);
  if (request.pasteForm == "OK") {
    console.log(request.pasteForm);
    storageGet();
    //sendResponse({ pasteForm: "Pasted" });
  }
});

// let remove = function() {
//   document.querySelector("#s2id_function > ul > li.select2-search-choice").parentNode.removeChild(document.querySelector("#s2id_function > ul > li.select2-search-choice"));
// };

let makeTextBlack = function() {
  let style = document.createElement("STYLE");
  var cssText = document.createTextNode(".select2-default > span { color: #000000 !important} #s2id_country_id > a > span {color: #000000}"); // makes text black colored for country, state i position type
  style.appendChild(cssText);
  document.head.appendChild(style);
};

document.addEventListener("keydown", function(event) { // retrieving data from server and filling out the form
    if (event.code == 'F2') {
      event.preventDefault();
      storageGet();
    }
  }
);

function storageGet() {
  let usaStateDisplay = document.querySelector("#s2id_state_id > a > span");
  let countryDisplay = document.querySelector("#s2id_country_id > a > span");
  let positionTypeDisplay = document.querySelector("#s2id_position > a > span");

  makeTextBlack();
  document.querySelector("#specialty").disabled = false; // enables specialty entry independently from function entry

  chrome.storage.local.get(["body"], function(ivy) {
    if (ivy.body) {
      Object.entries(ivy.body).forEach(item => {
        //console.log(item);
        if (typeof item[1] == "object" && Object.keys(item[1]).length > 0) { // only if object and if not an empty one
          Object.values(item[1]).forEach(value => {
            document.querySelector(`#s2id_${item[0]} > ul`).insertAdjacentHTML("afterbegin",
                                   `<li class="select2-search-choice" id="${item[0]}${value.idIvy}"><div>${value.nameString}</div><a href="#${item[0]}${value.idIvy}" onclick="document.querySelector('#s2id_${item[0]} > ul > li.select2-search-choice').parentNode.removeChild(document.querySelector('#${item[0]}${value.idIvy}'));
                                   document.querySelector('#${item[0]}').options[${value.idIvy}].selected = false;" class="select2-search-choice-close" tabindex="-1"></a></li>`);
            document.querySelector(`#${item[0]}`).options[value.idIvy].selected = true;
          });
        } else if (document.getElementById(`${item[0]}`)) {
            document.getElementById(`${item[0]}`).value = item[1];
        } else if (item[0] == "advertText") {
            document.querySelector("#cke_1_contents > iframe").contentWindow.document.body.innerText = ivy.body.advertText;
        } else {
          usaStateDisplay.innerText = ivy.body.usaState;
          countryDisplay.innerText = ivy.body.country;
          positionTypeDisplay.innerText = ivy.body.positionTypeText;
        }
      });

      // ******************
      // Jquery ajax verify

      $.ajax({
        type: "POST",
        url: "/employers/jobs/verify-duplicate",
        data: $("#post_job").serialize(),
        success: function(t) {
          $("#verify-duplicate")
            .parent()
            .find(".alert")
            .remove();
          $("#post_job")
            .find(".alert-error")
            .remove();
          if (t.error) {
            e();
            $.each(t.messages, function(e, a) {
              $('[name="' + e + '"]')
                .parent()
                .append(
                  '<div class="alert alert-error"><span>' +
                    a[Object.keys(a)[0]] +
                    "</span></div>"
                );
            });
          } else {
            if ($("#company_web_site_radio").is(":checked")) {
              if (!t.duplicate) {
                a();
                $("#verify-duplicate")
                  .parent()
                  .prepend(
                    '<div class="alert alert-success"><a>There is no duplicate job in database</a></span></div>'
                  );
              } else {
                e();
                $("#verify-duplicate")
                  .parent()
                  .prepend(
                    '<div class="alert alert-error"><a>Job already exists! <a href="' +
                      t.weblink +
                      '" target="_blank">external link</a></span></div>'
                  );
              }
            } else {
              a();
              $("#verify-duplicate")
                .parent()
                .prepend(
                  '<div class="alert alert-success"><a>OK</a></span></div>'
                );
            }
          }
        }
      });

      function a() {
        $('#post_job [type="submit"]').removeAttr("disabled");
      }
      function e() {
        $('#post_job [type="submit"]').attr("disabled", "disabled");
      }
      $(
        '[name="title"], [name="original_title"], [name="city"], [name="state_id"],[name="country_id"], [name="weblink"]'
      ).on("change keyup blur", function() {
        if ($("#company_web_site_radio").is(":checked")) {
          e();
        }
      }); 
      // End of Jquery Verify
      // ********************

      chrome.storage.local.clear(function() {
        if (chrome.runtime.lastError) {
          console.log("Error: " + JSON.stringify(chrome.runtime.lastError));
        } else {
          console.log("Memory cleared.");
        }
      });
    }
  });
}


// ***** Code not used anymore, but could still be needed if jquery ivy verify snippet stops working for whatever reason
// --------------------------------
//document.querySelector('#s2id_function').onfocus = function() {
// document.querySelector('#s2id_autogen4').classList.add("select2-focused");
//};
//---------------------------------
// this code was removing warnings about missing country and state data. Unnecessery after native (jquery) ivy verify was added
// let att = document.createAttribute("onchange");
// att.value = `document.querySelector('#s2id_country_id > a > span').classList.remove("Warning");`;
// country_id.setAttributeNode(att);
// let att2 = document.createAttribute("onchange");
// att2.value = `document.querySelector('#s2id_state_id > a > span').classList.remove("Warning");`;
// state_id.setAttributeNode(att2);

//   if (ivy.body.usaState == "")  { // this line was placed before this line: usaStateDisplay.innerText = ivy.body.usaState; 
//       usaStateDisplay.classList.add("Warning"); (adding warning if no state was recognized)
//   };

//   if (ivy.body.country == "")  { // this line was placed before this line: countryDisplay.innerText = ivy.body.country;
//       countryDisplay.classList.add("Warning"); (adding warning if no country was recognized)
//   };