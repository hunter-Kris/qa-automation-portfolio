import { expect, test } from '@playwright/test';
import { parseMockAiResponse } from '../../utils/ai-response-validator';

test.describe('Mocked AI response contract', () => {
  test('@smoke accepts a valid final response', () => {
    const result = parseMockAiResponse(JSON.stringify({ type: 'final', message: 'Order is ready.' }));
    expect(result).toEqual({ type: 'final', message: 'Order is ready.' });
  });

  test('@smoke accepts a supported tool with valid required arguments', () => {
    const result = parseMockAiResponse(
      JSON.stringify({ type: 'tool_call', tool: 'search_catalog', arguments: { query: 'backpack', limit: 5 } })
    );
    expect(result.type).toBe('tool_call');
  });

  test('@regression rejects a tool call with missing required arguments', () => {
    const raw = JSON.stringify({ type: 'tool_call', tool: 'search_catalog', arguments: { query: 'backpack' } });
    expect(() => parseMockAiResponse(raw)).toThrow();
  });

  test('@regression rejects unsupported tools', () => {
    const raw = JSON.stringify({ type: 'tool_call', tool: 'delete_account', arguments: {} });
    expect(() => parseMockAiResponse(raw)).toThrow();
  });

  test('@regression rejects malformed JSON', () => {
    expect(() => parseMockAiResponse('{"type":"final",')).toThrow('AI response is not valid JSON');
  });

  test('@regression rejects missing response fields', () => {
    expect(() => parseMockAiResponse(JSON.stringify({ type: 'final' }))).toThrow();
  });

  test('@regression rejects incorrect argument data types and boundaries', () => {
    const outOfRange = JSON.stringify({
      type: 'tool_call',
      tool: 'search_catalog',
      arguments: { query: 'backpack', limit: 0 }
    });
    const wrongType = JSON.stringify({
      type: 'tool_call',
      tool: 'search_catalog',
      arguments: { query: 'backpack', limit: 'five' }
    });
    expect(() => parseMockAiResponse(outOfRange)).toThrow();
    expect(() => parseMockAiResponse(wrongType)).toThrow();
  });

  test('@regression rejects empty and null responses', () => {
    expect(() => parseMockAiResponse('')).toThrow('AI response must not be empty or null');
    expect(() => parseMockAiResponse(null)).toThrow('AI response must not be empty or null');
  });
});
