import "./exports.js";
function get(key, parse = JSON.parse) {
  try {
    return parse(sessionStorage[key]);
  } catch {
  }
}
const SNAPSHOT_KEY = "sveltekit:snapshot";
const SCROLL_KEY = "sveltekit:scroll";
get(SCROLL_KEY) ?? {};
get(SNAPSHOT_KEY) ?? {};
function invalidateAll() {
  {
    throw new Error("Cannot call invalidateAll() on the server");
  }
}
async function applyAction(result) {
  {
    throw new Error("Cannot call applyAction(...) on the server");
  }
}
{
  const console_warn = console.warn;
  console.warn = function warn(...args) {
    if (args.length === 1 && /<(Layout|Page|Error)(_[\w$]+)?> was created (with unknown|without expected) prop '(data|form)'/.test(
      args[0]
    )) {
      return;
    }
    console_warn(...args);
  };
}
export {
  applyAction as a,
  invalidateAll as i
};
