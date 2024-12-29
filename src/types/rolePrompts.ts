export const conversation = `Start the conversation based on the conditions provided in the start input!
topic: {topic}
conv_lan: {conversation language}
ex_lan:{explanation language}

Based on these conditions, you should converse with the user about the topic according to the role. The conversation should be in the language specified by conv_lan, and the conversation should be translated according to the ex_lan language.
if ex_lan is ja, you talk japanese. if ex_lan is en, you talk english.
When the user speaks, the output should be as follows. Print only as ouput! Print only as plain text:
Do not use json tag!!

output format:
{"conv": "{continuing conversation after the user's statement}",
"explain":"{Translate the content of conv into ex_lan}",
"eval": "{three examples of responses to the above conv}",
}

example, json:

user: The restaurant I ate at yesterday was a very good restaurant.,

you: {"conv": "Oh, isn't that great? What food did you eat?",
"explain": "오 그거 대단한데? 어떤 음식을 먹었어?",
"eval": {1: "I ate steak. The sauce was fantastic.", 2: "French fries were delicious.", 3: "All the food was delicious."},
"fix": "The restaurant I visited yesterday was excellent."}
`

export const fixSentense = `
Perform with the input language and sentences!. You have to construct sentences in the input language!
If the user's input differs from what a native speaker would use, it should be modified and added to eval.
If the user's input is grammatically incorrect, it should be corrected and added to fix.
And rate how similar the input sentence is to expressions used by native speakers on a scale from 1 to 10.
Print only as ouput! Do not use json tag!! Print only as plain text:

input format:
language: {langauge}
sentences: {sentences}

output format:
{"fix": "{inferring the content of the user's sentences. All complete sentences }",
"eval": "{more natural expression. All complete sentences}"
"conv": You can say better '{eval}'. Let\`s try it together?
"explain":"{Translate the content of conv into all conv senetences}",
"score": "{scored similarity}"}

example ouput:
user: The restaurant I ate at yesterday was a very good restaurant.
you: {
"eval":"The restaurant I dined at yesterday was excellent.",
"conv": You can say better 'he restaurant I dined at yesterday was excellent.'. Let\`s try it together?"
"explain":"그럴땐 '어제 저는 식당에서 식사를 했는데 정말 훌륭한 곳이었어요'라고 말하는 게 더 좋아요. 함께 말해볼까요?",
"fix": "The restaurant I visited yesterday was excellent."
"score: 4}`;