function determineJobFunction(functionKeywords, jobTitleArr) {
    functionKeywords.forEach(item => { 
      Object.keys(item).forEach(item2 => {
        if (item2 == "funKeywordArr") {
          let counter = 0; // counter (most probably) is to avoid duplicating functions if there are multiple triggers for the same function in jobTitleArr
          item[item2].forEach(item3 => { // item[item2] is funKeywordArr, and item3 is every member of that arr that is one of the obj properties that constitute functionKeywords array
            for (let i = 0; i < jobTitleArr.length; i++) {
              if (jobTitleArr[i] == item3 && counter == 0) {
                counter++;
                // console.log("Function found: " + item3);
                // console.log(item.idIvy);
                // console.log(item.nameString);
                if (item.nameString == "Consulting") flagConsulting = true;
                uniqueFunctions.push({
                  nameString: item.nameString,
                  idIvy: item.idIvy
                });
              }
            }
          });
        }
        if (item2 == "phrasesArr") {
          item[item2].forEach(item3 => { 
            if (jobTitle.includes(item3)) {
              // console.log("Function found (from phrase): " + item3);
              // console.log(item.idIvy);
              // console.log(item.nameString);
              uniqueFunctions.push({
                nameString: item.nameString,
                idIvy: item.idIvy
              });
            }
          })
        }
      });
    });
  
    if (flagConsulting == true) {
      // if title contains the term 'consulting' it turns IT/Strategy/Accouting into Consulting IT/Cons. Strategy/Cons. Accounting
      uniqueFunctions.forEach(item => {
        // console.log(item);
        if (item.idIvy == 8) {
          item.idIvy = 23;
          item.nameString = "Consulting - IT";
        }
        if (item.idIvy == 18) {
          item.idIvy = 22;
          item.nameString = "Consulting - Strategy";
        }
        if (item.idIvy == 0) {
          item.idIvy = 24;
          item.nameString = "Consulting - Accounting";
        }
        if (item.idIvy == 9999) {
          delete item.nameString;
          delete item.idIvy;
        }
      });
  
      let index = uniqueFunctions.findIndex(item => item.idIvy == 9999); // deletes intermediary Consulting function that does not exist as such in Ivy 
      uniqueFunctions.splice(index, 1);
    }
    // uniqueFunctions.forEach(item => {
    //   // just logging
    //   console.log(item);
    //   console.log(item.nameString);
    //   console.log(item.idIvy);
    // });
  }
  

  function determineJobSpecialty(specialtyKeywords, jobTitleArr) {
    specialtyKeywords.forEach(item => {
      Object.keys(item).forEach(item2 => {
        if (item2 == "specialtyKeywordsArr") {
          let counter = 0;
          item[item2].forEach(item3 => {
            for (let i = 0; i < jobTitleArr.length; i++) {
              if (jobTitleArr[i] == item3 && counter == 0) {
                counter++;
                console.log("Specialty found: " + item3);
                // console.log(item.idIvy);
                // console.log(item.nameString);
                uniqueSpecialties.push({
                  idIvy: item.idIvy,
                  nameString: item.nameString
                });
              }
            }
          });
        }
        if (item2 == "phrasesArr") {
          item[item2].forEach(item3 => { 
            if (jobTitle.includes(item3)) {
              console.log("Specialty found (from phrase): " + item3);
              // console.log(item.idIvy);
              // console.log(item.nameString);
              uniqueSpecialties.push({
                nameString: item.nameString,
                idIvy: item.idIvy
              });
            }
          })
        }
      });
    });
  
    // uniqueSpecialties.forEach(item => {
    //   // just logging
    //   console.log(item);
    //   console.log(item.nameString);
    //   console.log(item.idIvy);
    // });
  };