import { it, expect, describe } from '@jest/globals';
import 'core-js';
import '@testing-library/jest-dom';
import { render } from '@testing-library/vue';
import Input from './Input.vue';

describe('Input', () => {
  it('has is-invalid class when error is set', () => {
    const { container } = render(Input, {
      props: {
        id: 'username',
        label: 'Username',
        error: 'Error message',
      },
    });

    const input = container.querySelector('input');

    expect(input.classList).toContain('is-invalid');
  });

  it('does not have is-invalid class when error is not set', () => {
    const { container } = render(Input, {
      props: { id: 'username', label: 'Username' },
    });

    const input = container.querySelector('input');

    expect(input.classList).not.toContain('is-invalid');
  });

  it('has invalid feedback class for error message', () => {
    const { container } = render(Input, {
      props: {
        id: 'username',
        label: 'Username',
        error: 'Error message',
      },
    });

    const errorSpan = container.querySelector('span');

    expect(errorSpan.classList).toContain('invalid-feedback');
  });
});
