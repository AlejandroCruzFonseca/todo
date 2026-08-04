import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  it('renders the main heading and primary action', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /organize your day with mui/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task list/i })).toBeInTheDocument();
  });
});
