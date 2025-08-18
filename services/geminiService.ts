
import { GoogleGenAI, Type } from "@google/genai";
import { Prompt, AIRecommendation, SavedThread, DeepResearchData } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mock data.");
}

const MOCK_RESPONSE: AIRecommendation = {
    recommendation: "This is a mock response for the main recommendation. In a real scenario, KARA would provide a detailed guide on user research. For example, we would explore how to conduct effective user interviews, synthesize findings into actionable insights, and create data-driven personas that genuinely inform the design process. The goal is to build empathy and ensure every design decision is rooted in user needs.",
    choices: [
        { title: "Contextual Inquiry", description: "Observe users in their natural environment to gain deep insights into their behaviors, needs, and the context of their work." },
        { title: "User Surveys & Questionnaires", description: "Gather quantitative and qualitative data from a large user base to identify broad patterns, preferences, and pain points." },
        { title: "Competitive Analysis", description: "Evaluate competitor products to understand industry standards, identify opportunities for differentiation, and avoid common pitfalls." }
    ]
};

const MOCK_DEEP_RESEARCH: DeepResearchData = {
    summary: "This is a mock deep research summary. Based on the conversation about User Research, the primary goal is to establish a user-centric foundation. This involves moving from abstract ideas to concrete, data-driven personas and user stories. The following nuanced action items are critical for success.",
    nuances: [
        {
            title: "Establish a Recruitment Pipeline",
            detail: "Before conducting research, establish a clear and ethical pipeline for recruiting participants. Define criteria, create screeners, and manage consent forms. This ensures a consistent flow of relevant users for ongoing research.",
            importance: 1,
        },
        {
            title: "Synthesize Findings with Affinity Mapping",
            detail: "Don't just collect data; synthesize it. Use techniques like affinity mapping to group observations and identify recurring themes and patterns. This is how raw data becomes actionable insight.",
            importance: 2,
        },
        {
            title: "Create Actionable 'Job Stories,' Not Just Personas",
            detail: "While personas are useful, frame user needs as 'Job Stories' (When [situation], I want to [motivation], so I can [expected outcome]). This format is more actionable for designers and developers.",
            importance: 3,
        }
    ]
};

const MOCK_WORKSHOP_SUGGESTION = {
    suggestion: "This is a mock AI suggestion. Based on the goal, here are some actionable steps:\n1. Define clear, measurable outcomes for this phase.\n2. Break down the process into smaller, manageable tasks for the team.\n3. Assign owners and establish timelines to ensure accountability and progress."
};


export const getAiRecommendation = async (promptData: Prompt, historyTitles: string[] = []): Promise<AIRecommendation | { error: string }> => {
    if (!process.env.API_KEY) {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSE), 1000));
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const schema = {
          type: Type.OBJECT,
          properties: {
            recommendation: {
              type: Type.STRING,
              description: "A detailed, actionable, and structured recommendation in markdown format. Break down key sub-points, suggest best practices, and mention relevant methodologies or tools."
            },
            choices: {
              type: Type.ARRAY,
              description: "An array of 3 actionable choices or strategies that can be used as follow-up prompts.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "The title of the choice or strategy."
                  },
                  description: {
                    type: Type.STRING,
                    description: "A brief description of the choice."
                  },
                },
                required: ["title", "description"],
              },
            },
          },
          required: ["recommendation", "choices"],
        };
        
        const contextHistory = historyTitles.length > 0 
          ? `You are continuing a discussion. The conversation so far has covered: ${historyTitles.join(' -> ')}.`
          : '';

        const fullPrompt = `
As a world-class senior frontend engineer and UI/UX design expert named KARA, elaborate on the following topic. Provide a detailed recommendation and three distinct strategic choices for the next step.
${contextHistory}

Current Focus Title: ${promptData.title}
Details: "${promptData.description}"
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        try {
            const parsedData: AIRecommendation = JSON.parse(response.text);
            if (!parsedData.recommendation || !Array.isArray(parsedData.choices)) {
                 throw new Error("Invalid JSON structure received from API. Missing 'recommendation' or 'choices' array.");
            }
            return parsedData;
        } catch (e) {
             console.error("Failed to parse JSON response:", e, "Raw response:", response.text);
             return { error: `Failed to interpret KARA's response. The data structure was unexpected. Please try again.` };
        }

    } catch (error)
    {
        console.error("Error fetching AI recommendation:", error);
        if (error instanceof Error) {
            return { error: `Sorry, I encountered an error while generating the recommendation: ${error.message}. Please check the console for more details.` };
        }
        return { error: "An unknown error occurred while fetching the AI recommendation." };
    }
};

export const getDeepResearch = async (thread: SavedThread): Promise<DeepResearchData | { error: string }> => {
    if (!process.env.API_KEY) {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_DEEP_RESEARCH), 1500));
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const schema = {
            type: Type.OBJECT,
            properties: {
                summary: {
                    type: Type.STRING,
                    description: "A high-level summary of the entire conversation, framed as a strategic overview for the USER OPERATOR."
                },
                nuances: {
                    type: Type.ARRAY,
                    description: "A list of 3-5 deep, actionable nuances or workflow assignments. These should be ranked by importance.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: "A concise title for the nuanced point or action item."
                            },
                            detail: {
                                type: Type.STRING,
                                description: "A detailed explanation of the nuance, its context, and why it's important."
                            },
                            importance: {
                                type: Type.NUMBER,
                                description: "A ranking of the item's importance, where 1 is the most critical."
                            }
                        },
                        required: ["title", "detail", "importance"]
                    }
                }
            },
            required: ["summary", "nuances"]
        };

        const conversationHistory = thread.turns.map(turn => `Step: ${turn.promptTitle}\nKARA's Recommendation: ${turn.aiRecommendation.recommendation}`).join('\n\n---\n\n');

        const fullPrompt = `
As KARA, a deep research agent, your task is to analyze the following conversation thread between a USER OPERATOR and an AI GUIDE. The overarching topic is "${thread.originalPromptTitle}".

Synthesize the key takeaways from the discussion. Identify the most critical, underlying nuances that the operator must address to succeed. Formulate a structured, actionable workflow based on this synthesis.

The output must be a JSON object. Provide a brief summary and a list of "nuances" ranked by importance (1 being the most important).

Conversation History:
${conversationHistory}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        try {
            const parsedData: DeepResearchData = JSON.parse(response.text);
            if (!parsedData.summary || !Array.isArray(parsedData.nuances)) {
                throw new Error("Invalid JSON structure for deep research. Missing 'summary' or 'nuances'.");
            }
            // Sort by importance
            parsedData.nuances.sort((a, b) => a.importance - b.importance);
            return parsedData;
        } catch (e) {
            console.error("Failed to parse deep research JSON response:", e, "Raw response:", response.text);
            return { error: `Failed to interpret KARA's deep research. The data structure was unexpected.` };
        }

    } catch (error) {
        console.error("Error fetching deep research:", error);
        if (error instanceof Error) {
            return { error: `Sorry, an error occurred during deep research analysis: ${error.message}.` };
        }
        return { error: "An unknown error occurred during deep research analysis." };
    }
};

export const getWorkshopEnhancement = async (nuanceTitle: string, fieldName: string, existingContent: string): Promise<{ suggestion: string } | { error: string }> => {
    if (!process.env.API_KEY) {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_WORKSHOP_SUGGESTION), 1000));
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const schema = {
            type: Type.OBJECT,
            properties: {
                suggestion: {
                    type: Type.STRING,
                    description: `Detailed, well-structured text for the '${fieldName}' section of a planning document, written in markdown. Provide actionable and specific points.`
                }
            },
            required: ["suggestion"]
        };

        const fullPrompt = `
As a world-class project manager and UI/UX strategist named KARA, you are helping a USER OPERATOR flesh out a planning document.
The overall strategic goal is: "${nuanceTitle}".
The specific section to generate content for is: "${fieldName}".

The user has already written the following (if it's empty, generate a strong starting point):
"${existingContent}"

Generate enhanced, detailed, and actionable content for this section. Build upon the user's input if it exists. The output must be a single JSON object with a 'suggestion' key.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        try {
            const parsedData = JSON.parse(response.text);
            if (!parsedData.suggestion) {
                throw new Error("Invalid JSON structure for workshop enhancement. Missing 'suggestion'.");
            }
            return parsedData;
        } catch (e) {
            console.error("Failed to parse workshop enhancement JSON:", e, "Raw response:", response.text);
            return { error: `Failed to interpret KARA's suggestion.` };
        }

    } catch (error) {
        console.error("Error fetching workshop enhancement:", error);
        if (error instanceof Error) {
            return { error: `Sorry, an error occurred while generating content: ${error.message}.` };
        }
        return { error: "An unknown error occurred while generating content." };
    }
};