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