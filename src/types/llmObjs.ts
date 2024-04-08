export type UserPrompt = {
    role: string,
    content: string
}

export interface ChatObject {
    model: string;
    message: Array<UserPrompt>
}

export interface ChatAI {
    fix: string;
    purpose: string
    conversation: string
}