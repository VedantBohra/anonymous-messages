import { cohere } from "@/lib/cohere-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. 
Each suggestion should be separated by "||". These suggestions are for an anonymous social messaging 
platform like Qooh.me and should be suitable for a diverse audience. Avoid personal or sensitive topics, 
focusing instead on universal themes that encourage friendly interactions.

Base your suggestions on the following message history: ${message?.length > 0 ? JSON.stringify(message) : '[No messages provided]'}

If No messages provided then just use something similar to the following Example output.
Example output: 
"What's a hobby you have recently started?"||"If you could have dinner with any historical figure, who would it be?"||"What’s something new you learned recently?"

Ensure the suggestions are intriguing, foster curiosity, and contribute to a positive, friendly environment.`;

  try {
    const response = await cohere.chat({
      model: "command-a-03-2025", 
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.message?.content?.[0]?.text?.trim() ?? "No response from the model";

    return NextResponse.json(
      {
        success: true,
        suggestions: text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cohere API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate suggestions.",
      },
      { status: 500 }
    );
  }
}
