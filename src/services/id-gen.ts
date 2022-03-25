import {performance} from 'perf_hooks';

export function genID() {
  return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
 };
