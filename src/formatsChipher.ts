//Worked out from: https://github.com/TeamNewPipe/NewPipeExtractor
import helpers from "./fetchers/helpers";
import { HTTPRequestMethod } from "./interfaces/HTTPClient";
import { WrappedHTTPClient } from "./WrappedHTTPClient";

const REGEXES = [
  new RegExp("(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)" + "\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*\"\"\\s*\\)"),
  new RegExp("\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\)"),
  new RegExp("\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)"),
  new RegExp("([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(\"\"\\)\\s*;"),
  new RegExp("\\b([\\w$]{2,})\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(\"\"\\)\\s*;"),
  new RegExp("\\bc\\s*&&\\s*d\\.set\\([^,]+\\s*,\\s*(:encodeURIComponent\\s*\\()([a-zA-Z0-9$]+)\\(")
];

export async function decipher(formats: Array<any>, playerURL: string, httpClient: WrappedHTTPClient) {
  const playerResults = await httpClient.request({
    method: HTTPRequestMethod.GET,
    url: playerURL
  });

  const playerJS = playerResults.data;

  let deobfuscateFunctionName:any = "";
  for(const reg of REGEXES) {
    deobfuscateFunctionName = matchGroup1(reg, playerJS);
    if(deobfuscateFunctionName) {
      break;
    }
  }

  const functionPattern = new RegExp("(" + deobfuscateFunctionName.replace("$", "\\$") + "=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})");
  const deobfuscateFunction = "var " + matchGroup1(functionPattern, playerJS) + ";";

  const helperObjectName = matchGroup1(new RegExp(";([A-Za-z0-9_\\$]{2})\\...\\("), deobfuscateFunction);
  const helperPattern = new RegExp("(var " + helperObjectName + "=\\{.+?\\}\\};)");
  const helperObject = matchGroup1(helperPattern, helpers.replaceAll("\n", "", playerJS));
  
  const finalFunc = eval(`(function getDecipherFunction() {
    ` + helperObject + `
    ` + deobfuscateFunction + `

    return (val) => ` + deobfuscateFunctionName + `;
  })()`)();

  for(const format of formats) {
    if(format.signatureCipher) {
      const signatureParams = parseQuery(format.signatureCipher);
      const resolvedSignature = finalFunc(signatureParams.s);
      const finalURL = new URL(signatureParams.url);
      finalURL.searchParams.set(signatureParams.sp, resolvedSignature)
      format.url = finalURL.toString();
    }
  }

  return formats;
}


function matchGroup1(regex: RegExp, str: string) {
  const res = regex.exec(str);
  if(!res) return "";
  return res[1];
}

function parseQuery(queryString:string) {
  var query:any = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}