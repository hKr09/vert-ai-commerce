// app/routes/api/generate.jsx
import { json } from "@remix-run/node";

// OpenAI API configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4";

export const action = async ({ request }) => {
  try {
    // Only allow POST requests
    if (request.method !== "POST") {
      return json(
        { success: false, error: "Method not allowed" },
        { status: 405 }
      );
    }

    // Parse form data
    const form = await request.formData();
    const prompt = form.get("prompt");

    // Validate input
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return json(
        { success: false, error: "Prompt is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY environment variable is not set");
      return json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Log the received prompt for debugging
    console.log("Generating content for prompt:", prompt);

    // Prepare the request to OpenAI
    const openaiRequest = {
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a professional e-commerce content writer specializing in creating engaging product descriptions, marketing copy, and social media posts for Shopify stores. 
          
          Your task is to generate compelling, conversion-focused content based on the user's input. The content should be:
          - Engaging and persuasive
          - Optimized for e-commerce conversion
          - Professional yet approachable
          - Suitable for various marketing channels (product pages, social media, email campaigns)
          - Clear and easy to read
          
          Format your response as clean, well-structured text that can be directly used in marketing materials.`
        },
        {
          role: "user",
          content: prompt.trim()
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    // Call OpenAI API
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(openaiRequest),
    });

    // Handle OpenAI API errors
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      
      return json(
        { 
          success: false, 
          error: `OpenAI API error: ${errorData.error?.message || openaiResponse.statusText}` 
        },
        { status: 500 }
      );
    }

    // Parse OpenAI response
    const openaiData = await openaiResponse.json();
    const generatedText = openaiData.choices?.[0]?.message?.content;

    if (!generatedText) {
      console.error("No content generated from OpenAI");
      return json(
        { success: false, error: "No content was generated" },
        { status: 500 }
      );
    }

    // Log successful generation
    console.log("Successfully generated content:", generatedText.substring(0, 100) + "...");

    // Return successful response
    return json({
      success: true,
      generatedText: generatedText.trim(),
      prompt: prompt.trim(),
      model: OPENAI_MODEL,
      usage: openaiData.usage
    });

  } catch (error) {
    // Handle unexpected errors
    console.error("Error in generate API:", error);
    
    return json(
      { 
        success: false, 
        error: "An unexpected error occurred while generating content" 
      },
      { status: 500 }
    );
  }
};
