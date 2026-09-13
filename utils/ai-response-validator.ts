import { z } from 'zod';

const finalResponseSchema = z.object({
  type: z.literal('final'),
  message: z.string().min(1)
});

const searchCatalogSchema = z.object({
  type: z.literal('tool_call'),
  tool: z.literal('search_catalog'),
  arguments: z.object({
    query: z.string().min(1),
    limit: z.number().int().min(1).max(50)
  })
});

const orderStatusSchema = z.object({
  type: z.literal('tool_call'),
  tool: z.literal('get_order_status'),
  arguments: z.object({
    orderId: z.string().regex(/^ORD-\d+$/)
  })
});

const toolCallSchema = z.discriminatedUnion('tool', [searchCatalogSchema, orderStatusSchema]);
const mockAiResponseSchema = z.union([finalResponseSchema, toolCallSchema]);

export type MockAiResponse = z.infer<typeof mockAiResponseSchema>;

export function parseMockAiResponse(raw: string | null): MockAiResponse {
  if (raw === null || raw.trim() === '') {
    throw new Error('AI response must not be empty or null');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('AI response is not valid JSON');
  }

  return mockAiResponseSchema.parse(parsed);
}
