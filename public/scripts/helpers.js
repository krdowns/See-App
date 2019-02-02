const signupSuccess = (json) => {
    let tokenJson = {token: json.token, user: json.result[0]}
    saveStuff(tokenJson) 
  }
  
  const loginSuccess = (json) => {
  }
  
  
  const signupError= (e1, e2, e3) => {
    console.log("E1: ", e1)
    console.log("E2: ", e2)
    console.log("E3: ", e3)
  }
  
  const loginError = (e1, e2, e3) => {
    console.log("E1: ", e1)
    console.log("E2: ", e2)
    console.log("E3: ", e3)
  }
  
  
  // Retrieve your data from locaStorage
  
  // Store your data.
  function saveStuff(obj) {
    saveData.obj = obj;
    saveData.time = new Date().getTime();
    localStorage.saveData = JSON.stringify(saveData);
  }
  
  function loadStuff() {
    return saveData.obj || "default";
  }