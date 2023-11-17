import { it, expect, describe, test } from '@jest/globals';
import 'core-js';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/vue';
import SignUpPage from './SignUp.vue';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import i18n from '../../locales/i18n';

describe('SignUp page', () => {
  const renderSignUpPage = () => {
    render(SignUpPage, { global: { plugins: [i18n] } });
  };

  describe('Layout', () => {
    it('has SighUp header', () => {
      renderSignUpPage();
      const header = screen.queryByRole('heading', { name: 'SignUp page' });

      expect(header).not.toBeNull();
    });

    it('has username input', () => {
      renderSignUpPage();

      const input = screen.queryByPlaceholderText('Username');
      expect(input).toBeInTheDocument();
    });

    it('has username input label', () => {
      renderSignUpPage();

      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('has email input', () => {
      renderSignUpPage();
      const input = screen.queryByPlaceholderText('E-mail');
      expect(input).toBeInTheDocument();
    });

    it('has email input label', () => {
      renderSignUpPage();
      const input = screen.getByLabelText('E-mail');
      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      renderSignUpPage();
      const input = screen.queryByPlaceholderText('Password');
      expect(input).toBeInTheDocument();
    });

    it('has password input label', () => {
      renderSignUpPage();
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    it('has password type for password input ', () => {
      renderSignUpPage();
      const input = screen.getByLabelText('Password');
      expect(input.type).toBe('password');
    });

    it('has confirm password input', () => {
      renderSignUpPage();
      const input = screen.queryByPlaceholderText('Confirm Password');
      expect(input).toBeInTheDocument();
    });

    it('has confirm password input label', () => {
      renderSignUpPage();
      const input = screen.getByLabelText('Confirm Password');
      expect(input).toBeInTheDocument();
    });

    it('has confirm password type for password input ', () => {
      renderSignUpPage();
      const input = screen.getByLabelText('Confirm Password');
      expect(input.type).toBe('password');
    });

    it('Has submit button', () => {
      renderSignUpPage();
      const button = screen.queryByRole('button', { name: 'Submit' });

      expect(button).toBeInTheDocument();
    });

    it('Submit button is disabled', () => {
      renderSignUpPage();
      const button = screen.queryByRole('button', { name: 'Submit' });

      expect(button).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    async function clickSubmit() {
      const button = screen.queryByRole('button', { name: 'Submit' });
      await userEvent.click(button);
    }

    async function fillTheForm() {
      renderSignUpPage();

      const password = screen.queryByPlaceholderText('Password');
      const confirmPassword = screen.queryByPlaceholderText('Confirm Password');
      const username = screen.queryByPlaceholderText('Username');
      const email = screen.queryByPlaceholderText('E-mail');

      await userEvent.type(email, 'user1@mail.com');
      await userEvent.type(username, 'user1');
      const userPass = '123Zasdsd2@';
      await userEvent.type(password, userPass);
      await userEvent.type(confirmPassword, userPass);
    }

    const server = setupServer();

    beforeAll(() => server.listen());
    afterAll(() => server.close());
    beforeEach(() => server.resetHandlers());

    test('submit button is enable when password and confirm password are same', async () => {
      renderSignUpPage();
      const password = screen.queryByPlaceholderText('Password');
      const confirmPassword = screen.queryByPlaceholderText('Confirm Password');
      const button = screen.queryByRole('button', { name: 'Submit' });

      const userPass = '123Zasdsd2@';
      await userEvent.type(password, userPass);
      await userEvent.type(confirmPassword, userPass);

      expect(button).not.toBeDisabled();
    });

    it('sends username, email and password to backend after clicking submit button', async () => {
      let reqBody;
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          reqBody = req.body;
          return res(ctx.status(200));
        }),
      );

      await fillTheForm();
      await clickSubmit();

      expect(reqBody).toEqual({
        email: 'user1@mail.com',
        username: 'user1',
        password: '123Zasdsd2@',
      });
    });

    it('does not allow clicking to the button when there is an ongoing api call', async () => {
      let coutner = 0;
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          coutner = coutner + 1;
          return res(ctx.status(200));
        }),
      );

      server.listen();
      await fillTheForm();
      await clickSubmit();

      await server.close();

      expect(coutner).toBe(1);
    });

    it('displays spinner while api request is waiting', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(200));
        }),
      );

      await fillTheForm();
      await clickSubmit();

      const spinner = screen.queryByRole('status');

      expect(spinner).toBeInTheDocument();
    });

    it('does not displays spinner while ther is no api request is waiting', async () => {
      await fillTheForm();
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();
    });

    it('shows account activation information after successful signup', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(200));
        }),
      );

      await fillTheForm();
      await clickSubmit();

      const activationMessage = await screen.findByText('Please check your email to activate your account');

      expect(activationMessage).toBeInTheDocument();
    });

    it('does not show account activation information after successful signup', async () => {
      await fillTheForm();

      const activationMessage = screen.queryByText('Please check your email to activate your account');

      expect(activationMessage).not.toBeInTheDocument();
    });

    it('does not show account activation information after failing signup', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(400));
        }),
      );

      await fillTheForm();
      await clickSubmit();

      await waitFor(() => {
        const text = screen.queryByText('Please check your email to activate your account');
        expect(text).not.toBeInTheDocument();
      });
    });

    it('hides signup form after successful signup', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(200));
        }),
      );

      await fillTheForm();
      const button = screen.queryByRole('button', { name: 'Submit' });
      // before clicking submit
      const form = screen.queryByTestId('signup-form');

      await userEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeVisible();
      });
    });

    it('hides spinner after error received', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(400));
        }),
      );
      await fillTheForm();
      await clickSubmit();

      await waitFor(() => {
        const spinner = screen.queryByRole('status');
        expect(spinner).not.toBeInTheDocument();
      });
    });

    it('enables the button after error', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(400));
        }),
      );
      await fillTheForm();
      await clickSubmit();

      await waitFor(async () => {
        const button = screen.queryByRole('button', { name: 'Submit' });

        expect(button).toBeEnabled();
      });
    });

    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'password'} | ${'Password cannot be null'}
      ${'email'}    | ${'E-mail cannot be null'}
    `('returns validation error message for $field field', async (params) => {
      const { message, field } = params;

      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: { [field]: message },
            }),
          );
        }),
      );
      await fillTheForm();
      await clickSubmit();
      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });

    it('displays mismatch message for password input', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(400));
        }),
      );
      renderSignUpPage();
      const password = screen.queryByPlaceholderText('Password');
      const confirmPassword = screen.queryByPlaceholderText('Confirm Password');

      await userEvent.type(password, '123Zasdsd2@');
      await userEvent.type(confirmPassword, '3rdfSomeDifferentPass#');

      await clickSubmit();

      const text = await screen.findByText('Password mismatch');
      expect(text).toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${'username'} | ${'Username cannot be null'} | ${'Username'}
      ${'password'} | ${'Password cannot be null'} | ${'Password'}
      ${'email'}    | ${'E-mail cannot be null'}   | ${'E-mail'}
    `('clears validation $field field error after input is updated', async ({ field, message, label }) => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ validationErrors: { [field]: message } }));
        }),
      );
      await fillTheForm();
      await clickSubmit();

      const input = screen.queryByPlaceholderText(label);
      await userEvent.type(input, 'updated');

      await waitFor(() => {
        const errorMessage = screen.queryByText(message);
        expect(errorMessage).not.toBeInTheDocument();
      });
    });
  });
});
