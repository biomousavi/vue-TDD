import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { expect, describe, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import App from './App.vue';
import i18n from '../locales/i18n';
import router from './router/index';

describe('App Routing', () => {
  const server = setupServer(
    http.post('/api/1.0/users/token/:token', () => {
      return new HttpResponse(null, { status: 200 });
    }),
  );

  // Start server before all tests
  beforeAll(() => server.listen());

  //  Close server after all tests
  afterAll(() => server.close());

  beforeEach(() => server.resetHandlers());

  async function renderApp(path) {
    const wrapper = mount(App, { global: { plugins: [i18n, router] } });

    await router.push(path);
    await router.isReady();

    return wrapper;
  }

  it('displays home page at /', async () => {
    const wrapper = await renderApp('/');
    const page = wrapper.find('[data-test="home-page"]');

    expect(page.exists()).toBe(true);
  });

  it('displays signup page at /signup', async () => {
    const wrapper = await renderApp('/signup');
    const page = wrapper.find('[data-test="signup-page"]');

    expect(page.exists()).toBe(true);
  });

  it('displays account activation page at /activation/123', async () => {
    const wrapper = await renderApp('/activation/123');
    const page = wrapper.find('[data-test="activation-page"]');

    expect(page.exists()).toBe(true);
  });

  it('displays home page after click header h2 ', async () => {
    const wrapper = await renderApp('/signup');

    const h2 = wrapper.find('h2');
    await h2.trigger('click');
    await flushPromises();

    const page = wrapper.find('[data-test="home-page"]');
    expect(page.exists()).toBe(true);
  });

  it('displays home page after click signup link in header ', async () => {
    const wrapper = await renderApp('/signup');

    const h2 = wrapper.find('h2');
    await h2.trigger('click');
    await flushPromises();

    const page = wrapper.find('[data-test="home-page"]');
    expect(page.exists()).toBe(true);
  });
});
