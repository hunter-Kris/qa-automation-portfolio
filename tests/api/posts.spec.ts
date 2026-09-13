import { expect, test } from '@playwright/test';
import { newPost, replacementPost } from '../../fixtures/api-data';
import { postListSchema, postSchema } from '../../utils/api-schemas';

const apiBaseUrl = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder posts API', () => {
  test('@smoke GET returns a post with the expected contract', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/posts/1`);
    expect(response.status()).toBe(200);
    expect(postSchema.parse(await response.json())).toMatchObject({ id: 1, userId: 1 });
  });

  test('@regression GET returns 404 for an unknown resource', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/posts/999999`);
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({});
  });

  test('@regression GET query respects a valid boundary user id', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/posts`, { params: { userId: 1 } });
    expect(response.status()).toBe(200);
    const posts = postListSchema.parse(await response.json());
    expect(posts).toHaveLength(10);
    expect(posts.every((post) => post.userId === 1)).toBe(true);
  });

  test('@smoke POST accepts a complete resource', async ({ request }) => {
    const response = await request.post(`${apiBaseUrl}/posts`, { data: newPost });
    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject({ ...newPost, id: 101 });
  });

  test('@regression POST exposes permissive handling of an invalid field type', async ({ request }) => {
    const invalidPayload = { ...newPost, userId: 'not-a-number' };
    const response = await request.post(`${apiBaseUrl}/posts`, { data: invalidPayload });
    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject(invalidPayload);
  });

  test('@regression POST exposes permissive handling of a missing required field', async ({ request }) => {
    const payloadWithoutTitle = { body: newPost.body, userId: newPost.userId };
    const response = await request.post(`${apiBaseUrl}/posts`, { data: payloadWithoutTitle });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).not.toHaveProperty('title');
    expect(body).toMatchObject({ ...payloadWithoutTitle, id: 101 });
  });

  test('@regression PUT replaces and PATCH partially updates a resource', async ({ request }) => {
    const putResponse = await request.put(`${apiBaseUrl}/posts/1`, { data: replacementPost });
    expect(putResponse.status()).toBe(200);
    expect(postSchema.parse(await putResponse.json())).toEqual(replacementPost);

    const patchResponse = await request.patch(`${apiBaseUrl}/posts/1`, {
      data: { title: 'Focused regression suite' }
    });
    expect(patchResponse.status()).toBe(200);
    expect(await patchResponse.json()).toMatchObject({ id: 1, title: 'Focused regression suite' });
  });

  test('@regression DELETE returns a successful empty response', async ({ request }) => {
    const response = await request.delete(`${apiBaseUrl}/posts/1`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({});
  });
});
