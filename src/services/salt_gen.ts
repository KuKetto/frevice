import {performance} from 'perf_hooks';

function salt() {
  return (performance.now().toString(32)+Math.random().toString(32)).replace(/\./g,"");
 };

export function genSalt() {
  let saltToReturn = "";
  for (let i = 0; i < 4; i++) saltToReturn += salt();
  return saltToReturn;
};
