chrome.storage.local.get(["body"], function(ivy) {
  if (ivy.body) {
    Object.keys(ivy.body).forEach(key => {
      let elem = document.getElementById(key);
      if (elem && ivy.body[key] != "") {
        if (Array.isArray(ivy.body[key])) {
          ivy.body[key].forEach(item => {
            Object.keys(item).forEach(key2 => {
              //console.log(key2 + " : " + item[key2]);
              if (key2 == "nameString")
              elem.innerHTML += ` - ${item[key2]}`;
            })
          })
          elem.parentElement.classList.add('is-visible');
        } else {
        elem.innerHTML = ivy.body[key];
        elem.parentElement.classList.add('is-visible');  
        }      
      };
    });
  }
});
