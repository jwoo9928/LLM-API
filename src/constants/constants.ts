import axios from "axios";
import * as FormData from 'form-data';
import { createReadStream, readFileSync } from 'fs';
import { ChatAI } from "src/types/llmObjs";

export function splitIntoJSON(str) {
  const regex = /(fix:|purpose:|conversation:)([^:]+)/g;
  const result = {};
  let match;

  while ((match = regex.exec(str)) !== null) {
    const key = match[1].slice(0, -1).toLowerCase();
    const value = match[2].trim();
    result[key] = value;
  }
  return result as ChatAI;
}

export const outputToJson = (text: string) => {
  console.log("input text: ",text)
  const pattern = /("fix"|"conv"|"eval"|"explain")\s*:\s*("([^"]+)"|\d+|[\[\{].*?[\]\}]|null)/ug;


  let matches = {
    eval: null,
    fix: null,
    conv: null,
    explain: null,
  };
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const key = match[1].replace(/"/g, ""); // 키워드에서 따옴표 제거
    const value = match[2];
    matches = {
      ...matches,
      [key]: value 
    }
  }
  matches.eval = JSON.parse(matches.eval);
  return JSON.stringify(matches)
}; 


export const outputToJsonWithScore = (text: string) => {
  console.log("input text: ",text)
  const pattern = /("fix"|"conv"|"eval"|"explain"|"score")\s*:\s*("([^"]+)"|\d+|[\[\{].*?[\]\}]|null)/ug;



  let matches = {
    eval: null,
    fix: null,
    conv: null,
    explain: null,
    score: null
  };
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const key = match[1].replace(/"/g, ""); // 키워드에서 따옴표 제거
    const value = match[2];
    matches = {
      ...matches,
      [key]: value 
    }
  }
  matches.eval = JSON.parse(matches.eval);
  matches.score = parseInt(matches.score) ?? 7;
  console.log("match: ",matches)
  return JSON.stringify(matches)
}; 