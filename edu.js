function getAllIndexes(array, arrayKeyWords) {
    let posArray = [];
    let posArraySecondWords = [];
    let reverseFlag = false; // Scrum goes before Master so it's treated as a separate case, because indexes are being compared differently later on
  
    for (let x = 0; x < arrayKeyWords.length; x++) {
      getIndexesForOne(array, arrayKeyWords[x]);
    }
  
    function getIndexesForOne(array, currentKeyWord) {
      if (currentKeyWord == "Scrum") reverseFlag = true; 
      let pos = 0;
      let i = -1;
      while (pos != -1) {
        pos = array.indexOf(currentKeyWord, i + 1);
        //console.log("Found at index: " + pos); // -1 means not found
        if (pos > 0) {
          if (currentKeyWord == arrayKeyWords[0]) {
            posArray.push(pos);
          } else {
            posArraySecondWords.push(pos);
          }
        }
        i = pos;
      }
    }
    return { posArray: posArray, posArraySecondWords: posArraySecondWords, reverseFlag: reverseFlag};
  };

  function spliceAdvertTextEducationArr(keywordIndexesObject) {
    let counter = 0; // counter used to correct position for the value of 1 after each splice, since advertTextEducationArr length is shortened for the value of 1 after each splice
    for (let i = 0; i < keywordIndexesObject.posArraySecondWords.length; i++) {
      for (let y = 0; y < keywordIndexesObject.posArray.length; y++) {
        if (keywordIndexesObject.posArraySecondWords[i] == keywordIndexesObject.posArray[y] - 1 && keywordIndexesObject.reverseFlag == true) {
          advertTextEducationArr.splice(keywordIndexesObject.posArray[y] - counter, 1);
          counter++;
          // console.log("Removing word 'Ms' at index: " + keywordIndexesObject.posArray[y]);
        } else if (keywordIndexesObject.posArraySecondWords[i] == keywordIndexesObject.posArray[y] + 1 && keywordIndexesObject.reverseFlag == false) {
          advertTextEducationArr.splice(keywordIndexesObject.posArray[y] - counter, 1);
          counter++;
          console.log("Removing word 'Ms' at index: " + keywordIndexesObject.posArray[y]);
        }
      }
    }
  };

  function determineEducation(educationKeywords, advertTextEducationArr) {
    let educationArrayOtherMaster = false;
    let uniqueEducationOtherMaster = false;
  
    if (websiteMatch == 'Nasa') {
      loggerOfAutoAssignment("education");
      uniqueEducationArr.push({
        idIvy: 5,
        nameString: "PhD"
      });
    } else {
      console.log('Education determination start');
      educationKeywords.forEach(item => {
        Object.keys(item).forEach(item2 => {
          if (item2 == "eduKeywordsArr") {
            item[item2].forEach(item3 => {
              for (let i = 0; i < advertTextEducationArr.length; i++) {
                advertTextEducationArr[i] = advertTextEducationArr[i].trim();
                if (advertTextEducationArr[i] == item3 /*&& counter == 0*/) {
                  // console.log("Education recognized: " + item3);
                  // console.log(item.idIvy);
                  // console.log(item.nameString);
                  uniqueEducationArr.push({
                    nameString: item.nameString,
                    idIvy: item.idIvy
                  });
                }
              }
            });
          }
          if (item2 == "phrasesArr") {
            item[item2].forEach(item3 => { 
              if (advertTextEducation.includes(item3)) {
                // console.log("Education recognized (from phrase): " + item3);
                // console.log(item.idIvy);
                // console.log(item.nameString);
                uniqueEducationArr.push({
                  nameString: item.nameString,
                  idIvy: item.idIvy
                });
              }
            })
          }
        });
      });
      // *** 'Other masters' snippet START ***
      // Snippet that ads Other Masters function if it was not recognized earlier and text mentions some of the words contained in otherMastersArr
      let otherMastersArr = ["Master", "Masters", "Master'S", "Master’S", "Masters'", "Masters’"];
  
      for (let i = 0; i < otherMastersArr.length; i++) {
        if (advertTextEducationArr.includes(otherMastersArr[i])) educationArrayOtherMaster = true;
      }
      uniqueEducationArr.forEach(item => {
        if (item.nameString == "Other Masters") uniqueEducationOtherMaster = true;
      });
      if ( educationArrayOtherMaster == true && uniqueEducationOtherMaster == false) {
        // console.log("Other master added");
        uniqueEducationArr.push({
          idIvy: 6,
          nameString: "Other Masters"
        });
      }
      // *** 'Other masters' snippet END ***

    }
    // uniqueEducationArr.forEach(item => {
    //   // just logging
    //   console.log(item);
    //   console.log(item.nameString);
    //   console.log(item.idIvy);
    // });
  };

// ********* Focused education lookup functions ************************

  function recognizeSentencesWithEducation(educationKeywords, currentSentence) {
    let counter = 0;
    let otherMasterFlag = false;
    let educationArrayOtherMaster = false;
    educationKeywords.forEach(item => {
      Object.keys(item).forEach(item2 => {
        if (item2 == "eduKeywordsArr") {
          currentSentence.forEach(currentWordInSentence => {
            item[item2].forEach(item3 => {
              if (currentWordInSentence == item3 && counter == 0) {
                counter++;
                if (item.nameString == "Other Masters") otherMasterFlag = true;
                // console.log("Found by sentence analysis: " + item3 + " " + item.nameString);
                sentencesWithEducationArr.push(currentSentence.join(" "));
              }
            });
          });
        }
      });
    });
  
    let otherMastersArr = ["Master", "Masters", "Master'S", "Master’S", "Masters'", "Masters’"];
  
    for (let i = 0; i < otherMastersArr.length; i++) {
      if (currentSentence.includes(otherMastersArr[i])) educationArrayOtherMaster = true;
    }
  
    if ( educationArrayOtherMaster == true && otherMasterFlag == false) {
      // console.log("Sentence containing other masters added");
      sentencesWithEducationArr.push(currentSentence.join(" "));
    }
  };      

  function focusedEducationLookup() {
    for (let i = 0; i < sentencesWithEducationArr.length; i++) {
      sentencesWithEducationArr[i] = sentencesWithEducationArr[i].split(" In ");
    }
    // console.log(sentencesWithEducationArr);
    
    let bachelorFlag = false;
    let masterFlag = false;
    let masterOptionFlag = false;
    let educationAfterInString = "";
    
    for (let i = 0; i < sentencesWithEducationArr.length; i++) {
      if (sentencesWithEducationArr[i].length > 1) {
       for (let y = 0; y < sentencesWithEducationArr[i].length; y++) {
        if (sentencesWithEducationArr[i][y].includes("Master")) {
          // console.log("SENTENCE: " + sentencesWithEducationArr[i][y] + " CONTAINS MASTER");
          masterFlag = true;
        } else if (sentencesWithEducationArr[i][y].includes("Bachelor")) {
          // console.log("SENTENCE: " + sentencesWithEducationArr[i][y] + " CONTAINS BACHELOR");
          bachelorFlag = true;
        } else {
          // console.log("SENTENCE: " + sentencesWithEducationArr[i][y] + " DOESN'T CONTAIN EDUCATION");
          educationAfterInString = sentencesWithEducationArr[i][y]; //.split(/,|;/gm);
        }
      }
    } else {
      if (sentencesWithEducationArr[i][0].includes("Master")) { // ovde treba dodati dodatne reci tipa Advanced Degree i sl.
        // console.log("SENTENCE: " + sentencesWithEducationArr[i][0] + " CONTAINS MASTER");
        masterOptionFlag = true;
      } else if (sentencesWithEducationArr[i][0].includes("Bachelor")) {
        // console.log("SENTENCE: " + sentencesWithEducationArr[i][0] + " CONTAINS BACHELOR");
      } else {
        // console.log("SENTENCE: " + sentencesWithEducationArr[i][0] + " DOESN'T CONTAIN EDUCATION")
      }
    }
    }
    // console.log(educationAfterInString);
    
    additionalEducation.forEach(additionalEducationObj => {
      for (let i = 0; i < additionalEducationObj.phrasesArr.length; i++) {
        if (educationAfterInString.includes(additionalEducationObj.phrasesArr[i]) && (masterFlag == true || masterOptionFlag == true)) {
          // console.log("Added by focused lookup: " + additionalEducationObj.phrasesArr[i] + " ivy: " + additionalEducationObj.nameString);
          uniqueEducationArr.push({
            nameString: additionalEducationObj.nameString,
            idIvy: additionalEducationObj.idIvy
          });
        }
        if (educationAfterInString.includes(additionalEducationObj.phrasesArr[i]) && bachelorFlag == true) {
          // console.log("Added by focused lookup: " + additionalEducationObj.phrasesArr[i] + " ivy: Bachelor's Degree");
        }
      }
    });
    }