import { expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from './Input.vue';

describe('Input', () => {
  it('has is-invalid class when error is set', async () => {
    const wrapper = mount(Input, {
      props: {
        id: 'username',
        label: 'Username',
        error: 'Error message',
      },
    });

    const input = wrapper.get('input');
    expect(input.classes('is-invalid')).toBe(true);
  });

  it('does not have is-invalid class when error is not set', () => {
    const wrapper = mount(Input, {
      props: { id: 'username', label: 'Username' },
    });

    const input = wrapper.get('input');
    expect(input.classes('is-invalid')).toBe(false);
  });

  it('has invalid-feedback class for error message', () => {
    const wrapper = mount(Input, {
      props: {
        id: 'username',
        label: 'Username',
        error: 'Error message',
      },
    });

    const span = wrapper.get('span');
    expect(span.classes('invalid-feedback')).toBe(true);
  });
});
