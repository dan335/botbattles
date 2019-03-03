import messageFunctions from './messageFunctions.js';


const onclose = function(event, manager, ws, ui) {
  if (event.code != 1000) {
    console.log(event);
  }
  ui.setState({isConnected:false});
}


const onopen = function(event, manager, ws, ui) {

}


const onerror = function(event) {
  console.log(event);
}


// calls function in messageFunctions.js by json.t name
const onmessage = function(event, manager, ws, ui) {
  const json = JSON.parse(event.data);

  try {
    messageFunctions[json.t](json, manager, ws, ui);
  } catch (error) {
    // probably erroring because json.t is a not declared in messageFunctions.js
    console.error(error);
  }
}


export { onmessage, onclose, onopen, onerror }
