# Gemini AI Integration

This workforce management platform includes enhanced AI capabilities powered by Google's Gemini AI.

## Features

- **Context-aware responses**: Gemini understands user roles, departments, and conversation history
- **Intelligent assistance**: Advanced understanding of workplace procedures and safety protocols
- **Fallback system**: Works with built-in responses if Gemini isn't configured
- **Secure configuration**: API keys are encrypted and stored securely

## Setup

### Option 1: Environment Variable (Development)
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy `.env.example` to `.env`
3. Add your API key: `VITE_GEMINI_API_KEY=your_key_here`

### Option 2: Admin Interface (Production)
1. Log in as a manager
2. Navigate to "AI Settings" in the sidebar
3. Enter your Gemini API key
4. Save configuration

## Usage

Once configured, all AI chat responses will be enhanced with Gemini's capabilities:

- More accurate and contextual answers
- Better understanding of industry-specific terminology
- Improved safety guidance and procedure explanations
- Context retention across conversation

## Security

- API keys are encrypted using the platform's secure storage
- Only managers can view or modify AI configuration
- Keys are never exposed in client-side code
- Fallback responses ensure functionality without API keys

## API Key Requirements

- Get a free API key from Google AI Studio
- Keys should start with "AIzaSy"
- No special setup required - just paste and save