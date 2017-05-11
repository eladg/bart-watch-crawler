import sources from "./data_sources.js";
import config from "./config.json";
import xml2js from "xml2js";
import http from "http";
import fs from "fs";
import path from "path";

import aws from 'aws-sdk';

import dotenv from "dotenv"; dotenv.config();

function log(msg) {
  console.log(Date.now() + ": " + msg);
}

function log_error(msg) {
  console.error(Date.now() + ": !! " + msg);
}

function fetchAndSave(source) {

  const code = source.code;
  const api_url = source.api_url;
  const s3key = `data/${code}/${Date.now()}.json`;

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
      log_error(error.message);

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
          log(`>> ${s3key} parsed`);

          const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
          const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

          aws.config.update({
            accessKeyId,
            secretAccessKey,
          });

          let s3 = new aws.S3();
          const params = {Bucket: config.s3_bucket, Key: s3key, Body: data};
          s3.putObject(params, function(err, data) {
            if (err) { return log_error(err); }

            log(`>> ${s3key} saved!`);
          });

        });

      } catch (e) {
        log_error(e.message);
      }

    });
  }).on('error', (e) => {
    log_error(`Got error: ${e.message}`);
  });
}

function crawl() {
  sources.forEach(function (source) {
    fetchAndSave(source);
  });  
}

log(">> Crawler: Start");
crawl();
