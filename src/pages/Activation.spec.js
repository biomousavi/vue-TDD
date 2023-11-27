import { it } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { flushPromises, mount } from '@vue/test-utils';
import Activation from './Activation.vue';
import { getRouter, createRouterMock, injectRouterMock } from 'vue-router-mock';

describe('Activation', async () => {
  const server = setupServer();
  const router = createRouterMock();

  // Start server before all tests
  beforeAll(() => server.listen());

  //  Close server after all tests
  afterAll(() => server.close());

  // Reset handlers before each test `important for test isolation`
  beforeEach(async () => {
    injectRouterMock(router);
    server.resetHandlers();
  });

  it('shows activation page when token is available', () => {
    server.use(
      http.post('/api/1.0/users/token/:token', () => {
        return new HttpResponse({}, { status: 200 });
      }),
    );

    const wrapper = mount(Activation);
    const el = wrapper.find("[data-test='activation-page']");

    expect(el.exists()).toBe(true);
  });

  it('sends activation request to backend', async () => {
    await getRouter().setParams({ token: '1234' });

    let counter = 0;
    server.use(
      http.post('/api/1.0/users/token/:token', () => {
        counter = counter + 1;
        return new HttpResponse({}, { status: 200 });
      }),
    );

    mount(Activation);
    await flushPromises();

    expect(counter).toBe(1);
  });

  it('shows activation success when token is correct', async () => {
    await getRouter().setParams({ token: '1234' });

    server.use(
      http.post('/api/1.0/users/token/:token', () => {
        return new HttpResponse({}, { status: 200 });
      }),
    );

    const wrapper = mount(Activation);

    await flushPromises();
    const h2 = wrapper.find('h2.alert-success');

    expect(h2.text()).toBe('Account is Activated');
  });

  it('shows activation faild when token is not correct', async () => {
    await getRouter().setParams({ token: '1234' });

    server.use(
      http.post('/api/1.0/users/token/:token', () => {
        return new HttpResponse({}, { status: 400 });
      }),
    );

    const wrapper = mount(Activation);

    await flushPromises();
    const h2 = wrapper.find('h2.alert-success');
    expect(h2.text()).toBe('Account was Failed');
  });

  it('displays spinner while api request is waiting', async () => {
    server.use(
      http.post('/api/1.0/users/token/:token', () => {
        return new HttpResponse({}, { status: 200 });
      }),
    );

    const wrapper = mount(Activation);
    const spinner = wrapper.find('[role="status"]');

    expect(spinner.exists()).toBe(true);
  });
});
