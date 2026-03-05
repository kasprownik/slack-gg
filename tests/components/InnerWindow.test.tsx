import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InnerWindow } from '../../src/components/InnerWindow';

describe('InnerWindow', () => {
  it('renders children', () => {
    render(<InnerWindow>Hello</InnerWindow>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders with raised variant', () => {
    const { container } = render(<InnerWindow raised>Content</InnerWindow>);
    const outerFrame = container.firstChild as HTMLElement;
    expect(outerFrame.className).toContain('raised');
  });

  it('renders with mergeDown variant', () => {
    const { container } = render(<InnerWindow mergeDown>Content</InnerWindow>);
    const outerFrame = container.firstChild as HTMLElement;
    expect(outerFrame.className).toContain('mergeDown');
  });

  it('renders with fill variant', () => {
    const { container } = render(<InnerWindow fill>Content</InnerWindow>);
    const outerFrame = container.firstChild as HTMLElement;
    expect(outerFrame.className).toContain('fill');
  });

  it('renders with compact variant', () => {
    const { container } = render(<InnerWindow compact>Content</InnerWindow>);
    const innerFrame = container.querySelector('[class*="innerFrame"]') as HTMLElement;
    expect(innerFrame.className).toContain('compact');
  });
});
