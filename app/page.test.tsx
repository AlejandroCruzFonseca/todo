import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  it('renders the main heading and links', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /to get started/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /deploy now/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /documentation/i })).toBeInTheDocument();
  });
});
