import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders the children inside the document body', () => {
    render(
      <RootLayout>
        <div>Child content</div>
      </RootLayout>
    );

    expect(document.documentElement).toHaveAttribute('lang', 'en');
    expect(document.body).toContainElement(screen.getByText('Child content'));
  });
});
