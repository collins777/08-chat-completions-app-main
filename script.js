// Get references to the DOM elements
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const responseContainer = document.getElementById("response");

// Store conversation history in an array
let messages = [
  {
    role: "system",
    content: `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination.

    If a user's query is unrelated to budget travel or the conversation, respond by stating that you do not know.`,
  },
];

// Listen for form submission
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Add the user's message to the conversation history
  messages.push({
    role: "user",
    content: userInput.value,
  });

  // Show loading animation and text while waiting for AI response
  responseContainer.innerHTML = `
    <span class="thinking-dots">
      Thinking
      <span class="spinner"></span>
      <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
    </span>
  `;

  // Send a POST request to the OpenAI API
  let result;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", // We are POST-ing data to the API
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
        Authorization: `Bearer ${apiKey}`, // Include the API key for authorization
      },
      // Send model details and conversation history
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
      }),
    });

    result = await response.json();

    // Add the AI's reply to the conversation history
    messages.push({
      role: "assistant",
      content: result.choices[0].message.content,
    });

    // Display the AI's reply on the page, preserving line breaks
    responseContainer.textContent = result.choices[0].message.content;
  } catch (error) {
    // Log the error and show a user-friendly message
    console.error("API error:", error);
    responseContainer.textContent =
      "Sorry, something went wrong. Please try again.";
  }

  // clear user input on submit
  userInput.value = "";
});
