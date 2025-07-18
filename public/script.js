const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';
  
  // Add a placeholder message that we can update later
  const botMessageElement = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error('Something went wrong with the API.');
    }

    const data = await response.json();
    // Update the placeholder's text with the actual reply
    botMessageElement.textContent = data.reply;
  } catch (error) {
    console.error('Error:', error);
    // Or update it with an error message
    botMessageElement.textContent = 'Sorry, I am having trouble connecting. Please try again later.';
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  // Return the new message element
  return msg;
}
