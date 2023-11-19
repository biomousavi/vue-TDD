import { expect, it, test } from 'vitest';
import { createI18n } from 'vue-i18n';
import { flushPromises, mount } from '@vue/test-utils';
import SignUpPage from './SignUp.vue';
import Language from '../components/Language.vue';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import en from '../../locales/en.json';
import fa from '../../locales/fa.json';

describe('SignUp page', () => {
  // initialize signup page wrapper
  const server = setupServer();
  let wrapper = renderSignUpPage();

  // Start server before all tests
  beforeAll(() => server.listen());

  //  Close server after all tests
  afterAll(() => server.close());

  // Mount signup wrapper
  beforeEach(() => {
    // Reset handlers before each test `important for test isolation`
    server.resetHandlers();
    wrapper = renderSignUpPage();
  });

  afterEach(() => wrapper.unmount());

  function renderSignUpPage() {
    const ComplexComponent = {
      components: { SignUpPage, Language },
      template: `
      <SignUpPage />
      <Language />`,
    };

    // creates new instance of i18n
    const i18n = createI18n({ locale: 'en', messages: { en, fa } });

    const wrapper = mount(ComplexComponent, { global: { plugins: [i18n] } });
    return wrapper;
  }

  async function fillTheForm() {
    const email = wrapper.find('[placeholder="E-mail"]');
    const username = wrapper.find('[placeholder="Username"]');
    const password = wrapper.find('[placeholder="Password"]');
    const confirmPassword = wrapper.find('[placeholder="Confirm Password"]');

    const userPass = '123Zasdsd2@';

    await username.setValue('user1');
    await password.setValue(userPass);
    await email.setValue('user1@mail.com');
    await confirmPassword.setValue(userPass);
  }

  async function clickSubmit() {
    const button = wrapper.find('button');
    await button.trigger('click');
  }

  describe('Layout', () => {
    it('has SighUp header', () => {
      const header = wrapper.find('h1');

      expect(header.exists()).toBe(true);
    });

    it('has username input', () => {
      const input = wrapper.find('[placeholder="Username"]');
      expect(input.exists()).toBe(true);
    });

    it('has username input label', () => {
      const input = wrapper.find('label[for="username"]');
      expect(input.text()).toEqual('Username');
    });

    it('has email input', () => {
      const input = wrapper.find('[placeholder="E-mail"]');
      expect(input.exists()).toBe(true);
    });

    it('has email input label', () => {
      const input = wrapper.find('label[for="email"]');
      expect(input.text()).toEqual('E-mail');
    });

    it('has password input', () => {
      const input = wrapper.find('[placeholder="Password"]');
      expect(input.exists()).toBe(true);
    });

    it('has password input label', () => {
      const input = wrapper.find('label[for="password"]');
      expect(input.text()).toEqual('Password');
    });

    it('has password type for password input ', () => {
      const input = wrapper.find('input[type="password"][placeholder="Password"]');
      expect(input.exists()).toBe(true);
    });

    it('has confirm password input', () => {
      const input = wrapper.find('[placeholder="Confirm Password"]');
      expect(input.exists()).toBe(true);
    });

    it('has confirm password input label', () => {
      const input = wrapper.find('label[for="confirm-password"]');
      expect(input.text()).toEqual('Confirm Password');
    });

    it('has confirm password type for password input ', () => {
      const input = wrapper.find('input[type="password"][placeholder="Confirm Password"]');
      expect(input.exists()).toBe(true);
    });

    it('Has submit button', () => {
      const button = wrapper.find('button');

      expect(button.text()).toEqual('Submit');
    });

    it('Submit button is disabled', () => {
      const button = wrapper.find('button[disabled]');
      expect(button.exists()).toBe(true);
    });
  });

  describe('Interaction', () => {
    test('submit button is enable when password and confirm password are same', async () => {
      const password = wrapper.find('[placeholder="Password"]');
      const confirmPassword = wrapper.find('[placeholder="Confirm Password"]');

      const userPass = '123Zasdsd2@';
      await password.setValue(userPass);
      await confirmPassword.setValue(userPass);

      await flushPromises();
      const button = wrapper.find('button');
      expect(button.attributes('disabled')).toBeUndefined();
    });

    test('submit button is disable when password and confirm password are same', async () => {
      const password = wrapper.find('[placeholder="Password"]');
      const confirmPassword = wrapper.find('[placeholder="Confirm Password"]');

      const userPass1 = '123Zasdsd2@';
      const userPass2 = '123Zasdsd2@aaa2';
      await password.setValue(userPass1);
      await confirmPassword.setValue(userPass2);

      await flushPromises();
      const button = wrapper.find('button[disabled]');

      expect(button.exists()).toBe(true);
    });

    it('sends username, email and password to backend after clicking submit button', async () => {
      let reqBody;

      server.use(
        http.post('/api/1.0/users', async ({ request }) => {
          reqBody = await request.json();
          return new HttpResponse(null, { status: 200 });
        }),
      );

      await fillTheForm();
      await clickSubmit();
      await flushPromises();

      expect(reqBody).toEqual({
        email: 'user1@mail.com',
        username: 'user1',
        password: '123Zasdsd2@',
      });
    });

    it('does not allow clicking to the button when there is an ongoing api call', async () => {
      let coutner = 0;
      server.use(
        http.post('/api/1.0/users', () => {
          coutner = coutner + 1;
          return new HttpResponse(null, { status: 200 });
        }),
      );

      await fillTheForm();
      await clickSubmit();
      await flushPromises();

      expect(coutner).toBe(1);
    });

    it('displays spinner while api request is waiting', async () => {
      server.use(
        http.post('/api/1.0/users', () => {
          return new HttpResponse(null, { status: 200 });
        }),
      );

      await fillTheForm();
      await clickSubmit();

      const spinner = wrapper.find('[role="status"]');

      expect(spinner.exists()).toBe(true);
    });

    it('does not displays spinner while ther is no api request is waiting', async () => {
      await fillTheForm();
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.exists()).toBe(false);
    });

    it('shows account activation information after successful signup', async () => {
      server.use(
        http.post('/api/1.0/users', () => {
          return new HttpResponse(null, { status: 200 });
        }),
      );

      await fillTheForm();
      await clickSubmit();
      await flushPromises();

      const activationMessage = wrapper.find('[data-test="account-activation"]');

      expect(activationMessage.exists()).toBe(true);
    });

    it('does not show account activation information after failing signup', async () => {
      server.use(
        http.post('/api/1.0/users', () => {
          return new HttpResponse(null, { status: 400 });
        }),
      );

      await fillTheForm();
      await clickSubmit();
      await flushPromises();

      const activationMessage = wrapper.find('[data-test="account-activation"]');

      expect(activationMessage.exists()).toBe(false);
    });

    it('hides signup form after successful signup', async () => {
      server.use(
        http.post('/api/1.0/users', () => {
          return new HttpResponse(null, { status: 200 });
        }),
      );

      await fillTheForm();
      await clickSubmit();
      await flushPromises();

      const form = wrapper.find('form[data-test="signup-form"]');
      expect(form.exists()).toBe(false);
    });

    it('hides spinner after error received', async () => {
      server.use(
        http.post('/api/1.0/users', () => {
          return new HttpResponse(null, { status: 400 });
        }),
      );

      await fillTheForm();
      await clickSubmit();
      await flushPromises();

      const spinner = wrapper.find('[role="status"]');
      expect(spinner.exists()).toBe(false);
    });

    it('enables the button after error', async () => {
      server.use(
        http.post('/api/1.0/users', () => {
          return new HttpResponse(null, { status: 400 });
        }),
      );

      await fillTheForm();
      await clickSubmit();
      await flushPromises();

      const button = wrapper.find('button');
      expect(button.attributes('disabled')).toBeFalsy();
    });

    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'password'} | ${'Password cannot be null'}
      ${'email'}    | ${'E-mail cannot be null'}
    `('returns validation error message for $field field', async ({ message, field }) => {
      server.use(
        http.post('/api/1.0/users', () => {
          return HttpResponse.json({ validationErrors: { [field]: message } }, { status: 400 });
        }),
      );

      await fillTheForm();
      await clickSubmit();
      await flushPromises();

      const span = wrapper.find(`span.invalid-feedback[data-test="${field}"]`);
      expect(span.text()).toBe(message);
    });

    it('displays mismatch message for password input', async () => {
      const password = wrapper.find('[placeholder="Password"]');
      const confirmPassword = wrapper.find('[placeholder="Confirm Password"]');

      await password.setValue('a password');
      await confirmPassword.setValue('a different password');

      await flushPromises();
      const span = wrapper.find("span.invalid-feedback[data-test='confirm-password'");

      expect(span.text()).toBe(en.passwordMismatch);
    });

    it.each`
      field         | message                      | label
      ${'username'} | ${'Username cannot be null'} | ${'Username'}
      ${'password'} | ${'Password cannot be null'} | ${'Password'}
      ${'email'}    | ${'E-mail cannot be null'}   | ${'E-mail'}
    `('clears validation $field field error after input is updated', async ({ field, message, label }) => {
      server.use(
        http.post('/api/1.0/users', () => {
          return HttpResponse.json({ validationErrors: { [field]: message } }, { status: 400 });
        }),
      );

      await fillTheForm();
      await clickSubmit();
      await flushPromises();

      const input = wrapper.find(`[placeholder="${label}"]`);
      await input.setValue('updated');
      await flushPromises();

      const span = wrapper.find(`span.invalid-feedback[data-test="${field}"]`);

      expect(span.text()).not.toBe(message);
    });
  });

  describe('Internationalization', () => {
    it('shows text in English by default', () => {
      expect(wrapper.find('h1').text()).toBe(en.signUp);
    });

    it('shows text in FA after selecting FA language', async () => {
      expect(wrapper.find('h1').text()).toBe(en.signUp);

      const Farsi = wrapper.find(".locale[title='فارسی'");
      await Farsi.trigger('click');

      expect(wrapper.find('h1').text()).toBe(fa.signUp);
    });

    it('shows password validation text in FA ', async () => {
      const password = wrapper.find('[placeholder="Password"]');
      const confirmPassword = wrapper.find('[placeholder="Confirm Password"]');

      await password.setValue('a password');
      await confirmPassword.setValue('a different password');

      const Farsi = wrapper.find(".locale[title='فارسی'");
      await Farsi.trigger('click');

      await flushPromises();

      const span = wrapper.find("span.invalid-feedback[data-test='confirm-password'");

      expect(span.text()).toBe(fa.passwordMismatch);
    });

    it('shows text in EN after selecting EN language', async () => {
      const Farsi = wrapper.find(".locale[title='فارسی'");
      await Farsi.trigger('click');

      const English = wrapper.find(".locale[title='English'");
      await English.trigger('click');

      await flushPromises();

      expect(wrapper.find('h1').text()).toBe(en.signUp);
    });
  });
});
