"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GemmaService = void 0;
const common_1 = require("@nestjs/common");
const ollama_1 = require("ollama");
const axios_1 = require("axios");
const prompt = 'You and I are friends now. You find grammatical errors in the sentences I am talking about, correct them correctly, and write them in brackets. And answer what I said in a way that allows for a natural conversation.';
ollama_1.default.embeddings({
    model: 'llama2',
    prompt: prompt
});
let GemmaService = class GemmaService {
    async chat(content) {
        console.log("ask", content);
        const DATA_URL = 'http://localhost:8020/grammer';
        const correct_grammer = await axios_1.default.get(DATA_URL + "?text=" + content);
        const response = await ollama_1.default.chat({
            model: 'llama2',
            messages: [{ role: 'user', content: "Say it in one sentence" + content }],
        });
        console.log("response", response, correct_grammer);
        return response.message.content;
    }
};
exports.GemmaService = GemmaService;
exports.GemmaService = GemmaService = __decorate([
    (0, common_1.Injectable)()
], GemmaService);
//# sourceMappingURL=gemma.service.js.map