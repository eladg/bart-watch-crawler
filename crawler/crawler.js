import sources from "./data_sources.js";
import config from "./config.json";
import xml2js from "xml2js";
import http from "http";
import fs from "fs";
import path from "path";

import { mkdirParent } from "../shared/utils";

function log(msg) {
  console.log(Date.now() + ": " + msg);
}

function error(msg) {
  console.error(Date.now() + ": " + msg);
}

function filenameForCode(code) {
  return `${config.data_path}/${code}/${Date.now()}.json`;
}

function fetchAndSave(source) {

  const code = source.code;
  const api_url = source.api_url;
  const filepath = filenameForCode(code);

  mkdirParent(path.dirname(filepath));

  return http.get(api_url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;

    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n` +
                        `Status Code: ${statusCode}`);
    } else if (!/^text\/xml/.test(contentType)) {
      error = new Error(`Invalid content-type.\n` +
                        `Expected text/xml but received ${contentType}`);
    }

    if (error) {
      console.error(error.message);

      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        let parser = new xml2js.Parser();
        parser.parseString(rawData, (err, result) => {
          const data = JSON.stringify(result);
          log(`>> ${filepath} parsed`);

          fs.writeFile(filepath, data, (err) => {
            if(err) { throw err; }
            log(`>> ${filepath} saved!`);
          });
        });

      } catch (e) {
        error(e.message);
      }

    });
  }).on('error', (e) => {
    error(`Got error: ${e.message}`);
  });
}

function crawl() {
  sources.forEach(function (source) {
    fetchAndSave(source);
  });  
}

log("Crawler: Start");
crawl();
