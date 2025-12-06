# LLM Integration - What Was Implemented

## Overview

The AI On-Call Engineer uses Large Language Models (LLMs) to automatically analyze production logs and identify root causes. The system supports **two LLM providers**:

1. **OpenAI GPT-4** (default)
2. **Anthropic Claude** (optional)

## What Was Implemented

### 1. Dual LLM Support

The system can use either:
- **OpenAI GPT-4** - Default, uses `gpt-4` model
- **Anthropic Claude** - Alternative, uses `claude-3-opus-20240229` model

### 2. Automatic Provider Selection

The system automatically chooses which LLM to use based on environment variables:
- If `USE_ANTHROPIC=true` AND `ANTHROPIC_API_KEY` is set → Uses Claude
- Otherwise → Uses OpenAI GPT-4

### 3. Log Analysis Workflow

When a log file is uploaded:

1. **Download from S3** - Retrieves the log file
2. **Truncate if needed** - Limits to last 50KB (to stay within token limits)
3. **Send to LLM** - Analyzes with structured prompt
4. **Parse response** - Extracts JSON with:
   - Summary
   - Root Cause
   - Suggested Fix
5. **Store results** - Saves to DynamoDB
6. **Notify Slack** - Sends notification with analysis

### 4. Structured Analysis Prompt

The LLM receives a carefully crafted prompt that asks for:

```
1. A brief summary of what happened
2. The root cause of the issue  
3. A suggested fix
```

Response format: JSON with `summary`, `rootCause`, and `suggestedFix` fields.

### 5. Error Handling

- Gracefully handles missing API keys
- Returns meaningful error messages
- Falls back appropriately if one provider fails

## Code Structure

### Main File: `backend/src/services/aiAnalyzer.ts`

**Key Functions:**

1. **`analyzeLogs()`** - Main entry point
   - Downloads log from S3
   - Truncates if too long
   - Calls appropriate LLM function
   - Updates DynamoDB with results
   - Sends Slack notification

2. **`analyzeWithOpenAI()`** - GPT-4 analysis
   - Uses OpenAI SDK
   - Model: `gpt-4`
   - Temperature: 0.3 (for consistent results)
   - Max tokens: 1500

3. **`analyzeWithClaude()`** - Claude analysis
   - Uses Anthropic SDK
   - Model: `claude-3-opus-20240229`
   - Temperature: 0.3
   - Max tokens: 1500

## Configuration

### Environment Variables

**For OpenAI (default):**
```env
OPENAI_API_KEY=sk-your-openai-key-here
```

**For Claude (optional):**
```env
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
USE_ANTHROPIC=true
```

### Which One to Use?

**OpenAI GPT-4:**
- ✅ Faster responses
- ✅ More widely available
- ✅ Good for general debugging
- ✅ Lower cost per request

**Anthropic Claude:**
- ✅ Better at complex reasoning
- ✅ More detailed analysis
- ✅ Better for nuanced issues
- ⚠️ Slightly slower
- ⚠️ Higher cost

## What Was Fixed

### Issue 1: TypeScript Compilation Error
**Problem:** `Property 'messages' does not exist on type 'Anthropic'`

**Solution:**
- Updated `@anthropic-ai/sdk` from `^0.9.1` to `^0.20.0`
- Fixed API compatibility issues

### Issue 2: Missing API Key Error
**Problem:** Server crashed if API key wasn't set

**Solution:**
- Made OpenAI client initialization conditional
- Added null checks before using clients
- Added proper error messages

## How It Works

```
User uploads log
    ↓
File saved to S3
    ↓
Incident created in DynamoDB (status: "analyzing")
    ↓
Log content downloaded from S3
    ↓
Content truncated to 50KB if needed
    ↓
Sent to LLM with structured prompt
    ↓
LLM analyzes and returns JSON:
    {
      "summary": "...",
      "rootCause": "...",
      "suggestedFix": "..."
    }
    ↓
Results saved to DynamoDB (status: "completed")
    ↓
Slack notification sent
    ↓
Frontend updates to show results
```

## Customization

### Change the Model

**For OpenAI:**
```typescript
// In analyzeWithOpenAI()
model: 'gpt-4',  // Change to 'gpt-3.5-turbo' for faster/cheaper
```

**For Claude:**
```typescript
// In analyzeWithClaude()
model: 'claude-3-opus-20240229',  // Change to 'claude-3-sonnet-20240229' for faster
```

### Adjust Temperature

Lower = more consistent, Higher = more creative
```typescript
temperature: 0.3,  // Current: balanced
// Try: 0.1 for very consistent, 0.7 for more varied responses
```

### Change Max Tokens

```typescript
max_tokens: 1500,  // Increase for longer analysis, decrease to save costs
```

### Modify the Prompt

Edit the prompt strings in:
- `analyzeWithOpenAI()` - line 77
- `analyzeWithClaude()` - line 128

## Testing

To test the LLM integration:

1. **Set API key** in `backend/.env`
2. **Upload a log file** via frontend
3. **Check dashboard** - should show analysis results
4. **Check Slack** - should receive notification

## Cost Considerations

**OpenAI GPT-4:**
- ~$0.03 per 1K input tokens
- ~$0.06 per 1K output tokens
- Average log analysis: ~$0.10-0.30

**Claude Opus:**
- ~$0.015 per 1K input tokens  
- ~$0.075 per 1K output tokens
- Average log analysis: ~$0.15-0.40

**Tips to reduce costs:**
- Use GPT-3.5-turbo instead of GPT-4
- Reduce max_tokens
- Truncate logs more aggressively (currently 50KB)

## Future Enhancements

Possible improvements:
- [ ] Support for more LLM providers (Gemini, etc.)
- [ ] Streaming responses for real-time updates
- [ ] Custom prompts per log type
- [ ] Cost tracking and limits
- [ ] Caching for similar logs
- [ ] Multi-model ensemble (use multiple LLMs and compare)

