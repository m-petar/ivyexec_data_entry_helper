chrome.runtime.sendMessage({ tabAuth: "Is_IP_authorized?" }, function(response) {
  console.log("Response: ", response.tabAuthResponse);
});
chrome.runtime.sendMessage({ setBadge: "title" }, function(response) {
  console.log(response.farewell);
});



window.addEventListener(
  "load",
  function(event) {
    url = document.URL; // assigns url value only after the page has loaded
    // console.log(url);

    const specialUrls = [
      ["https://npp.usra.edu/opportunities/details/", "Nasa"],
      ["https://www.usajobs.gov/GetJob/ViewDetails/", "UsaJobs"],
      ["https://careers-perspecta1.icims.com/jobs/", "VencorePerspecta"],
      ["https://careers.peopleclick.com/careerscp/client_argonnelab/", "Argonne"],
      ["https://careers.peopleclick.com/careerscp/Client_BrookhavenLab/", "Brookhaven"]
    ];

    for (let i = 0; i < specialUrls.length; i++) {
      //window[specialUrls[i][1]] = undefined; // we declare global variables named after each specialUrls array member 2nd element (must explicitly be assigned to undefined!) // deprecated
      if (url.includes(specialUrls[i][0])) { // recognizing website to later implement additional automation
        console.log("websiteMatch= " + specialUrls[i][1]);
        //window[specialUrls[i][1]] = specialUrls[i][1]; 
        websiteMatch = specialUrls[i][1];
      }
    }
  }
);

// ************ GLOBAL VARIABLES AND CONSTS **************

let url;
let websiteMatch;
let copyCounter = 0;
let jobTitle;
let jobTitleRaw;
let jobTitleArr = [];
let uniqueFunctions = [];
let uniqueFunctionsMap = [];
let uniqueSpecialties = [];
let uniqueSpecialtiesMap = [];
let advertText = null;
let cityName;
let countryID;
let country;
let usaState;
let usaStateID;
let locationObj;
let flagConsulting = false;
let newLineRegexPositionsArray;
const newLineRegexEnd = /\n$/; // regex that catches line break \n at string end (if we'd like to catch it at string start: /^\n/)
let advertTextEducation;
let advertTextEducationArr;
let uniqueEducationArr = [];
let uniqueEducationMap;
let experienceArr = [];
const experienceKeywordsRegex = /\d?\d? ?(\-|To|–)? ?\(?\d\d?\+?\)? ?(Plus)?\+?(Or More)? Y(ea)?rs?|(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen|Seventeen|Eighteen|Nineteen|Twenty) ?(Or More|Plus)? ?(\+|To)? ?(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen|Seventeen|Eighteen|Nineteen|Twenty)? Y(ea)?rs?/gm; // \d je isto sto i [0-9] tj. bilo koja cifra
let positionTypeID = "1";
let positionTypeText = "Full-Time";
let experienceObjArr = [];
let experienceObjArrMap;
let advertTextExperience;
const topTierPosNames = [ "Strategy", "Director", "Chief", "President", "Chair", "Head", "Principal", "Partner", "Architect" ];
let topTierFlag = false;
let hasBachelor = false;
let hasMaster = false;
let hasPhd = false;
let hasJd = false;
let hasEng = false;
let hasIT = false;
let experienceMin = 99;
let experience = 0;
let experienceMax = 0;
let sentencesWithEducationArr = [];

// ************* END OF GLOBAL VARIABLES AND CONSTS **************



function camelize(str) {
  return str.replace(/\w+/g, function(match) {
    return match.charAt(0).toUpperCase() + match.substring(1).toLowerCase();
  });
}

function loggerOfAutoAssignment(what) {
  console.log("Auto assignment of " + what);
}

function finalMapping(arrayOfObjects) {
  let arrayOfObjectsMap = [];
  let map = new Map();
        for (let item of arrayOfObjects) {
          if (!map.has(item.idIvy)) {
            // set any value to Map (we could map using nameString prop, would be the same, since they are both unique)
            map.set(item.idIvy, true); // set any value to Map
            arrayOfObjectsMap.push({
              idIvy: item.idIvy,
              nameString: item.nameString
            });
          }
        }
        return arrayOfObjectsMap;
};

function abbrAndMod() {
  const abbrAndModArray = [
    ["Ceo", "Chief", "Executive", "Officer"],
    ["Coo", "Chief", "Operations", "Officer"],
    ["Cboc", "Community", "Based", "Outpatient", "Clinic"],
    ["C&P", "Compensation", "&", "Pension"],
    ["Cfo", "Chief", "Financial", "Officer"],
    ["Dir", "Director"],
    ["Pr", "Public", "Relations"],
    ["ISR", "Intelligence", "Surveillance", "And", "Reconnaissanceciate"],
    ["Assoc", "Associate"],
    ["Humint", "Human", "Intelligence"],
    ["Geoint", "Geographic", "Intelligence"],
    ["Sigint", "Signals", "Intelligence"],
    ["Avp", "Associate", "Vice", "President"],
    ["Svp", "Senior", "Vice", "President"],
    ["Evp", "Executive", "Vice", "President"],
    ["Rvp", "Regional", "Vice", "President"],
    ["Vp", "Vice", "President"],
    ["Rcm", "Revenue", "Cycle", "Management"],
    ["Crm", "Customer", "Relationship", "Management"],
    ["Hris", "Human", "Resources", "Information", "Systems"],
    ["Hr", "Human", "Resources"],
    ["B2b", "Business-to-business"],
    ["L&D", "Learning", "And", "Development"],
    ["R&D", "Research", "And", "Development"],
    ["S&E", "Science", "And", "Engineering"],
    ["M&A", "Mergers", "And", "Acquisitions"],
    ["Evm", "Earned", "Value", "Management"],
    ["Opir", "Overhead", "Persistent", "Infrared"],
    ["Svcs", "Services"],
    ["Sec", "Securities", "And", "Exchange", "Commission"],
    ["Ia", "Information", "Assurance"],    
    ["Is", "Information", "Security"], 
    ["Pmo", "Project", "Management", "Office"],
    ["Qa", "Quality", "Assurance"],
    ["Q&A", "Quality", "Assurance"],
    ["Mgmt", "Management"],
    ["Mngr", "Manager"],
    ["Mgr", "Manager"],
    ["Ux", "User", "Experience"],
    ["Ops", "Operations"],
    ["Esh", "Environmental", "Health", "And", "Safety"],
    ["Fp&A", "Financial", "Planning", "And", "Analysis"],
    ["Sme", "Subject", "Matter", "Expert"],
    ["Aws", "AWS"],
    ["Gps", "GPS"],
    ["Stem", "STEM"],
    ["It", "IT"],
    ["I", ""],
    ["Ii", ""],
    ["Iii", ""],
    ["Iv", ""],
    ["V", ""],
    ["Vi", ""],
    ["Vii", ""]
  ];

  for (let i = 0; i < abbrAndModArray.length; i++) {
    if (jobTitleArr.indexOf(abbrAndModArray[i][0]) > -1) // // array has 6 members max & in case it has less the remaining args are just skipped w/o throwing an error
      jobTitleArr.splice(jobTitleArr.indexOf(abbrAndModArray[i][0]), 1, abbrAndModArray[i][1], abbrAndModArray[i][2], abbrAndModArray[i][3], abbrAndModArray[i][4], abbrAndModArray[i][5]);
  }
}

function settingPositionType() {
  if (
    jobTitleArr.includes("Intern") ||
    jobTitleArr.includes("Internship")
  ) {
    positionTypeID = "5";
    positionTypeText = "​Internship";
  } else if (
    jobTitleArr.includes("Months") ||
    jobTitleArr.includes("Temporary")
  ) {
    positionTypeID = "4";
    positionTypeText = "​Project-Based";
  } else if (jobTitleArr.includes("Part") ||
    jobTitleArr.includes("Fee")) {
    positionTypeID = "3";
    positionTypeText = "Part-Time";
  }
}

document.addEventListener("keydown", hotkey);

function hotkey(event) {
  if (event.code == 'F3') { // for reset 
    event.preventDefault();
    chrome.storage.local.clear(function() {
      if (chrome.runtime.lastError) {
        console.log("greska: " + JSON.stringify(chrome.runtime.lastError));
      } else {
        chrome.runtime.sendMessage({ setBadge: "title" }, function(response) {
          console.log(response.farewell);
        });
      }
    });
    chrome.runtime.sendMessage({ reloadExtension: "reload" }, function(
      response
    ) {
      console.log(response.farewell);
    });
  }

  if (event.code == 'F4' && advertText && window.getSelection().toString() == "") {
    // ad text must be set and deselected for event to be triggered
    // by pressing F4 name of the city is assigned to an empty string (cases where there's no city name in ad)
    event.preventDefault();
    cityName = "";
    main(event);
  }
  if (event.code == 'F1') { // main function triggered with F1
    event.preventDefault();
    main(event);
  }
}

// ***************************************************
// ******************** M A I N **********************

function main(event) {
  copyCounter++;
  function getSelectedText(event) {
    // checks if an iframe (path of the copied text leads to Window element (that is the last in path array) that has frameElement property == null )
    return (event.path[event.path.length - 1].frameElement == null) ? window.getSelection().toString() : event.path[event.path.length - 1].getSelection().toString();  
    }

  switch (copyCounter) {
    case 1:
      if (websiteMatch == 'Nasa') {
        loggerOfAutoAssignment("title");
        jobTitle = document.querySelector("#npp_main > h3").innerText;
        //jobTitle = "PR Managing Director"; // testing value (works only on NASA website!)
      } else if (websiteMatch == 'UsaJobs') {
        loggerOfAutoAssignment("title");
        jobTitle = document.getElementById("job-title").innerText;
      } else if (websiteMatch == 'VencorePerspecta') {
        loggerOfAutoAssignment("title");
        jobTitle = document.getElementsByTagName("iframe")[0].contentWindow.document.querySelectorAll("div > h1")[0].innerText;
        //jobTitle = "Mechanical Engineer Cyber"; // testing value
      } else {
        jobTitle = getSelectedText(event);
        //jobTitle = "Electrical Mechanical Engineer VI"; // testing value
      }
      //console.log(copyCounter);
      //console.log(jobTitle);
      jobTitleRaw = jobTitle;
      jobTitle = jobTitle.trim(); // trims empty spaces from string start and end
      jobTitle = jobTitle.replace(/\//g, " / ");
      jobTitle = camelize(jobTitle);
      if (newLineRegexEnd.test(jobTitle)) {
        jobTitle = jobTitle.slice(0, jobTitle.search(newLineRegexEnd)); // shortens arr
      }
      jobTitleArr = jobTitle.split(/ |-|,|:|\(|\)/);
      
      settingPositionType();
      abbrAndMod(jobTitleArr);
      
      // filtering out arr members that were created as a result of missing args in abbrAndMod(), then filtering out empty strings (that were the result of splitting at punctuation chars)
      jobTitleArr = jobTitleArr.filter(item => item != undefined).filter(item => item != "");   

      //console.log(jobTitleArr);
 
      jobTitle = jobTitleArr.join(" ");
      //console.log("jobTitle after join: " +  jobTitle);

      if (websiteMatch == 'Nasa') jobTitle = camelize(jobTitleRaw);
      
      determineJobFunction(functionKeywords, jobTitleArr); // populates uniqueFunctions array with objects containing 2 props: job function ID & job function name present in jobTitleArr
      uniqueFunctionsMap = finalMapping(uniqueFunctions);

      // console.log(uniqueFunctionsMap);

      determineJobSpecialty(specialtyKeywords, jobTitleArr);
      uniqueSpecialtiesMap = finalMapping(uniqueSpecialties);

      chrome.runtime.sendMessage({ setBadge: "cityOrText" }, function(response) {
        console.log(response.farewell);
      });
      break;

    case 2:
    case 3:
      if (  // if selected string has more than 7 words it is treated as advert main text 
        getSelectedText(event).split(" ").length > 7 ||
        ((websiteMatch == 'Nasa' && !advertText) ||
          (websiteMatch == 'UsaJobs' && !advertText) ||
          (websiteMatch == 'VencorePerspecta' && !advertText))
      ) {
        if (websiteMatch == 'Nasa') {
          loggerOfAutoAssignment("text");
          advertText = document.querySelector("#proj_detail_table > tbody > tr:nth-child(7) > td").innerText;
        } else if (websiteMatch == 'UsaJobs') {
          loggerOfAutoAssignment("text");
          advertText =document.querySelector("#duties > div:nth-child(4) > p").innerText + "\n" + document.querySelector("#duties > #duties").innerText + "\n" + document.querySelector("#requirements > ul").innerText + "\n" + document.getElementById("qualifications").textContent;
        } else if (websiteMatch == 'VencorePerspecta') {
          loggerOfAutoAssignment("text");
          advertText = document.getElementsByTagName("iframe")[0].contentWindow.document.querySelectorAll("div.iCIMS_InfoMsg.iCIMS_InfoMsg_Job")[1].innerText + "\n" + document.getElementsByTagName("iframe")[0].contentWindow.document.querySelectorAll("div.iCIMS_InfoMsg.iCIMS_InfoMsg_Job")[2].innerText;
              // testing values:
              // advertText = "BS We need MS or MA for this M.D. position, as Ph.D. Pharm.D. well as managerial Ll.M knowledge of MS Office, as well as MS Word. Also a JD Edwards is needed."; 
              // advertText = "We JD need MS Word Juris Doctor and also J D need MS or MA for this Master Planning position, as Scrum Master well as JD Edwards knowledge of MS Office suite.";
              // advertText = "conditions: BS with 3-7 years of experience";
        } else {
          advertText = getSelectedText(event);
        }
        //console.log(advertText);

        let focusedEduLookupAdvertText = advertText;  // copies advertText for the purpose of additional ('focused') search for education at the end


        // *********** TEMORARILY DISABLED DUE TO STRICKTER COMPANY RULEZ INTRODUCED ON NOV 23 2020 ***************
        // reduces multiple consecutive new lines to only one \n
        // advertText = advertText.replace(/\n/g, function(match, offset) {
        //   if (advertText[offset + 1] == "\u00a0" || advertText[offset + 1] == "\n") { // at this point method has already ecountered "\n" so it checks what's at next index
        //     return ""; // and if there is &nbsp; or another \n they are replaced by an empty string (/\u00a0/ is regex(unicode) value for &nbsp;)
        //   }
        //   return "\n"; // if neither of previous 2 conditions were met, which means it found any other character it inserts "\n"
        // });
        // *********** END OF TEMORARILY DISABLED DUE TO STRICKTER COMPANY RULEZ INTRODUCED ON NOV 23 2020 ***************


        //console.log(advertText);

        // testing values:
        //advertText = "We need MS or MA for this position, as well as knowledge of MS Office suite. Also a JD Edwards is needed.";
        //advertText = " 4-5 years of financial reporting experience with a SEC registrant 6-12 years of overall financial accounting and reporting experience";
        //advertText = "Bachelor, degree in communications, business or public administration, journalism, marketing, information technology or equivalent experience. What we desire: Master of Business Administration. with a focus on Marketing Management. Previous experience developing or enhancing websites, mobile apps and social media strategies for a Master'S Degree, Master'S In Finance. consumer-facing brand. Masters Degree In Information Technology";
        //advertText = "we need 5-7 Years Experience 5-12 Years Experience 5 - 12 Years Experience 3 Years Experience 4+ Years Experience 3 + Years Experience  12-14 Years Experience 1-4 Years Experience 5 Year Experience 12 Years Experience  15+ Years Experience 13 + Years Experience One Year Ten Years Five Years Four Years Three+ Years Seven + Years Five To Seven Years A minimum of Ten + Years Five+ Years of professional Five (5) Years of experience Eight Or More Years Five Or More Years Twelve (12) Years of experience Or More Years";
        advertTextEducation = camelize(advertText);
        if (advertTextEducation.includes("Juris Doctorate")) advertTextEducation = advertTextEducation.replace("Doctorate", ""); // to avoid Juris Doctorate being recognized by both Juris and Doctorate
        //console.log(advertTextEducation);

        advertTextExperience = advertTextEducation;

        // to pay attention to this since education is determined after removing these chars from text
        advertTextEducationArr = advertTextEducation.split(/ |\/|-|•|,|\.|\n|;|:|\(|\)/).filter(item => item != ""); // filters out empty string array members that were created as a result of punctuation filtering 
        advertTextEducation = advertTextEducationArr.join(" ");

        // console.log(advertTextEducation);
        // console.log(advertTextEducationArr);

        // 1st indexes of these array members are stored and then those words are filtered out:
        spliceAdvertTextEducationArr(getAllIndexes(advertTextEducationArr, ["Ms", "Word", "Access", "Project", "PowerPoint", "Office", "Windows", "Excel", "Technologies", "SharePoint", "Sql", "Share"])); 
        spliceAdvertTextEducationArr(getAllIndexes(advertTextEducationArr, ["Jd", "Edwards"]));
        spliceAdvertTextEducationArr(getAllIndexes(advertTextEducationArr, ["Master", "Planning"]));
        spliceAdvertTextEducationArr(getAllIndexes(advertTextEducationArr, ["Master", "Scrum"]));
        
        // console.log(advertTextEducationArr);
        
        determineEducation(educationKeywords, advertTextEducationArr)
        // console.log(uniqueEducationArr);

// ************* ***********  ********  ***** *** ** ** *
// Focused education lookup
// ************* ***********  ********  ***** *** ** ** *

focusedEduLookupAdvertText = camelize(focusedEduLookupAdvertText);
focusedEduLookupAdvertText = focusedEduLookupAdvertText
  .replace(/,/gm, " ,")
  .replace(/\./gm, " .")
  .replace(/\n/gm, " ---LINEBREAK--- ");

let focusedEduLookupAdvertTextSentences = focusedEduLookupAdvertText.split(/---LINEBREAK---|\./gm);
// console.log(focusedEduLookupAdvertTextSentences);

for (let i = 0; i < focusedEduLookupAdvertTextSentences.length; i++) {
  focusedEduLookupAdvertTextSentences[i] = focusedEduLookupAdvertTextSentences[i].split(" ");
  recognizeSentencesWithEducation(educationKeywords, focusedEduLookupAdvertTextSentences[i]);
}

// console.log("Sentences With Education: " + sentencesWithEducationArr);

focusedEducationLookup();

// ************* ***********  ********  ***** *** ** ** *
// End of Focused education lookup
// ************* ***********  ********  ***** *** ** ** *

        uniqueEducationMap = finalMapping(uniqueEducationArr);
        //console.log(uniqueEducationMap.length);

        // ************************
        // ***** Experience ********
        // ************************

        settingFlags();
        experienceLookup();
        // console.log(experienceArr);
        extractingExperience();
        correctingExperience();
        // console.log("experienceMin final value: " + experienceMin);
        // console.log("experience final value: " + experience);
        // console.log("experienceMax final value: " + experienceMax);

      if (experience > 0) {
        populateExperienceObjectArr (experience, ">= and <");
      }

      if (experienceMax > 0 && experienceMax > experience) {
        populateExperienceObjectArr (experienceMax, "> and <=");
      }

      if (experienceMin < 99 && experienceMin < experience) {
        populateExperienceObjectArr (experienceMin, ">= and <");
      }
        
      // experienceObjArr.forEach(item => {
      //   // just logging
      //   console.log(item);
      //   console.log(item.nameString);
      //   console.log(item.idIvy);
      // });
    
        experienceObjArrMap = finalMapping(experienceObjArr); // new array from adding only object with unique idIvy property:  

        filterEducationExperience();
        
        //console.log(experienceObjArrMap);

        // *******************************
        // ***** Experience - End ********
        // *******************************

        if (cityName == undefined) {
          chrome.runtime.sendMessage({ setBadge: "city" }, function(response) {
            console.log(response.farewell);
          });
        } else {
          chrome.runtime.sendMessage({ setBadge: "title" }, function(response) {
            console.log(response.farewell);
          });
          storageSet();
          break;
        }
        break;
      } else {
        // if selected text is a string with <7 words which is treated as city name entry 
        if (websiteMatch == 'Nasa') {
          loggerOfAutoAssignment("location");
          cityName = document.querySelector("#proj_detail_table > tbody > tr:nth-child(3) > td").firstChild.nextSibling.nextSibling.textContent.substring(3).split(",")[0];
        } else if (websiteMatch == 'UsaJobs') {
          loggerOfAutoAssignment("location");
          cityName = document.querySelector("#locations > ul > li > a > div.usajobs-joa-locations__body > span.usajobs-joa-locations__city").innerText.split(",")[0];
        } else if (websiteMatch == 'VencorePerspecta') {
          loggerOfAutoAssignment("location");
          function contains(selector, text) { // lookup (within an iframe) for a selector containing text (selector & text are passed as funct args)
            let elements = document.getElementsByTagName("iframe")[0].contentWindow.document.querySelectorAll(selector);
            return Array.prototype.filter.call(elements, function(element) {
               return RegExp(text).test(element.textContent);
            });
          }
          cityName = contains("dt", "Job Location")[0].nextElementSibling.textContent.trim().split("-")[1];
        } else if (websiteMatch == 'Argonne') {
          loggerOfAutoAssignment("location");
          cityName = "Lemont";           // all jobs in this company are at the same location therefore it is hardcoded
        } else if (websiteMatch == 'Brookhaven') {
          loggerOfAutoAssignment("location");
          cityName = "Long Island"; // all jobs in this company are at the same location therefore it is hardcoded
        } else {
          cityName = getSelectedText(event);
          // cityName = "Boston"; // testing value
        }

        cityName = cityName.trim();
        // console.log(cityName);
        // console.log(copyCounter);
        if (newLineRegexEnd.test(cityName)) {
          cityName = cityName.slice(0, cityName.search(newLineRegexEnd));
        }
        cityName = camelize(cityName);
        locationObj = locationData.find(c => c.city == cityName);
        if (locationObj) {
          if (!locationObj.country) {
            countryID = "1";
            country = "USA";
            usaStateID = locationObj.usaStateID;
            usaState = locationObj.usaState;
          }
          if (!locationObj.usaState) {
            usaStateID = "53";
            usaState = "N/A";
            countryID = locationObj.countryID;
            country = locationObj.country;
          }
        } else {
          // console.log("Location has not been found");
          chrome.runtime.sendMessage({ setBadge: "text" }, function(response) {
            console.log(response.farewell);
          });
          usaState = "";
          country = "";
        }

        // console.log(locationObj);

        if (advertText == undefined) {
          chrome.runtime.sendMessage({ setBadge: "text" }, function(response) {
            console.log(response.farewell);
          });
          break;
        } else {
          chrome.runtime.sendMessage({ setBadge: "title" }, function(response) {
            console.log(response.farewell);
          });
          storageSet();
          break;
        }
      }
  }
}

function storageSet() {
  chrome.storage.local.set(
    {
      body: {
        title: jobTitle,
        original_title: jobTitleRaw,
        company_web_site: url,
        city: cityName,
        state_id: usaStateID,
        usaState: usaState,
        country_id: countryID,
        country: country,
        advertText: advertText,
        position: positionTypeID,
        positionTypeText: positionTypeText,
        function: uniqueFunctionsMap,
        degree: uniqueEducationMap,
        experience: experienceObjArrMap,
        specialty: uniqueSpecialtiesMap
      }
    },
    function() {
      if (chrome.runtime.lastError) {
        // in case of an error, log can be seen in console on this page: _generated_background_page.html (Details > Inspect views > background page)
        console.log("Error: " + JSON.stringify(chrome.runtime.lastError));
      } else {
        console.log("Saved successfully using storageSet!");
        uniqueFunctionsMap.length = uniqueSpecialtiesMap.length = uniqueFunctions.length = uniqueEducationArr.length = uniqueEducationMap.length = experienceObjArr.length = experienceObjArrMap.length = copyCounter = 0;
        cityName = advertText = undefined;
      }
    }
  );
}
