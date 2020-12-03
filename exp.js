function settingFlags() { 
    for (let i = 0; i < topTierPosNames.length; i++) {
      if (jobTitle.includes(topTierPosNames[i])) {
        topTierFlag = true;
      }
    }
    
    uniqueEducationMap.forEach(item => {
      if (
        item.idIvy == "6" ||
        item.idIvy == "0" ||
        item.idIvy == "30" ||
        item.idIvy == "27" ||
        item.idIvy == "11" ||
        item.idIvy == "18" ||
        item.idIvy == "28" ||
        item.idIvy == "16"
      ) hasMaster = true;
      if (item.idIvy == "5" || item.idIvy == "7" || item.idIvy == "4") hasPhd = true;
      if (item.idIvy == "3") hasJd = true;
      if (item.idIvy == "14") hasBachelor = true;
    });
  
    uniqueFunctions.forEach(item => {
      if (item.idIvy == 20) hasEng = true;
    });
    uniqueFunctions.forEach(item => {
      if (item.idIvy == 8) hasIT = true;
    });
  };
  
function experienceLookup() {
  advertTextExperience.replace(experienceKeywordsRegex, function(match) {
      match = match.trim();
      experienceArr.push(match);
    });
  
    //console.log(experienceArr);
  
    experienceArr = experienceArr.map(item =>
      item
        .replace(/ ?\+? Years?/, "")
        .replace(/\(|\)/g, "")
        .replace(" Or More", "")
        .replace(" To ", "-")
        .replace(/ /g, "")
        .replace(/–/g, "-")
        .replace(/One/g, "1")
        .replace(/Two/g, "2")
        .replace(/Three/g, "3")
        .replace(/Four/g, "4")
        .replace(/Five/g, "5")
        .replace(/Six/g, "6")
        .replace(/Seven/g, "7")
        .replace(/Eight/g, "8")
        .replace(/Nine/g, "9")
        .replace(/Ten/g, "10")
        .replace(/Eleven/g, "11")
        .replace(/Twelve/g, "12")
        .replace(/Thirteen/g, "13")
        .replace(/Fourteen/g, "14")
        .replace(/Fifteen/g, "15")
        .replace(/Sixteen/g, "16")
        .replace(/Seventeen/g, "17")
        .replace(/Eighteen/g, "18")
        .replace(/Nineteen/g, "19")
        .replace(/Twenty/g, "20")
    );
  };
  
  function extractingExperience() {
    experienceArr.forEach(item => {
      if (item.includes("-")) {
        // console.log(item);
        let tempMin = parseInt(item.split("-")[0]);
        let tempMax = parseInt(item.split("-")[1]);
        // console.log(tempMin);
        // console.log(tempMax);
        if (tempMin > 0 && tempMin < experienceMin) experienceMin = tempMin;
        if (tempMin > 0 && tempMin > experience && tempMin <= 25) experience = tempMin; // < 25 is just to avoid any bigger number that might appear in the text
        if (tempMax > experienceMax && tempMax <= 25) experienceMax = tempMax; // < 25 is just to avoid any bigger number that might appear in the text
      } else {
        if (parseInt(item) > 0 && parseInt(item) < experienceMin) experienceMin = parseInt(item);
        if (parseInt(item) > 0 && parseInt(item) > experience && parseInt(item) <= 25) // < 25 is just to avoid any bigger number that might appear in the text
          experience = parseInt(item); 
      }
      // console.log("experienceMin: " + experienceMin);
      // console.log("experience: " + experience);
      // console.log("experienceMax: " + experienceMax);
    });
  };

  function correctingExperience() {
    if (experience > experienceMin && uniqueEducationMap.length > 0) {
      if ((+hasBachelor + hasMaster + hasPhd + hasJd) === 1) { // bools are 1st coerced to numbers as 1 or 0, so if only one is true it would be equal to 1
        experienceMin = 99; // if only bachelor/master/phd/jd is present, experienceMin (if it exists) should be ignored (that's why we reset it to 99) and take into account only experience (if it exists and is bigger than experienceMin)
      }
    }
  };
  
  // function correctingExperience() { refactored ↥↥↥↥↥↥↥↥
  //   if (experience > experienceMin && uniqueEducationMap.length > 0) {
  //     if (hasBachelor == true && hasMaster == false && hasPhd == false && hasJd == false) {
  //       experienceMin = 99; 
  //     }
  
  //     if (hasBachelor == false && hasMaster == true && hasPhd == false && hasJd == false) {
  //       experienceMin = 99; 
  //     }
  
  //     if (hasBachelor == false && hasMaster == false && hasPhd == true && hasJd == false) {
  //       experienceMin = 99; 
  //     }
  
  //     if (hasBachelor == false && hasMaster == false && hasPhd == false && hasJd == true) {
  //       experienceMin = 99;
  //     }
  //   }
  // };
  
  function populateExperienceObjectArr (exp, operator) {
    if (operator == ">= and <") experienceObjArr.push(experienceDataArray.find(item => exp >= item.floor && exp < item.ceiling));
    if (operator == "> and <=") experienceObjArr.push(experienceDataArray.find(item => exp > item.floor && exp <= item.ceiling));
  }
  
  function filterEducationExperience() { 
    if (uniqueEducationMap.length > 0 && topTierFlag == false && hasMaster == false && hasPhd == false && hasJd == false) { // must be: uniqueEducationMap.length > 0 so that the experience would not be shortened in case the education data does not exist while experience does
      experienceObjArrMap = experienceObjArrMap.filter(
        function(item) {
          return item.idIvy != "0" && item.idIvy != "1"; // if not a top tier position due to title and education it throws out education shorter than 5 years if education is bachelor
        }
      );
    };
    if (uniqueEducationMap.length > 0 && topTierFlag == false && (hasMaster == true || hasJd == true)) {
      experienceObjArrMap = experienceObjArrMap.filter(
        function(item) {
          return item.idIvy != "0"; // if not a top tier position due to title and education it throws out education shorter than 3 years if education is master
        }
      );
    };
  
    if ( (uniqueFunctions.length == 1 && topTierFlag == false && (hasIT == true || hasEng == true)) || (uniqueFunctions.length == 2 && topTierFlag == false && hasIT == true && hasEng == true) ) {
      uniqueEducationMap = uniqueEducationMap.filter(
        function(item) {
          return item.idIvy == "5" || item.idIvy == "7" || item.idIvy == "4"; // keeps only Phd, other doctoral and MD as education, if function is Eng or IT and is not top-tier
        }
      );
    };
  };