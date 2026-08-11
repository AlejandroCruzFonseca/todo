import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the main heading and task form controls', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /organize your day with mui/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('displays tasks from localStorage and shows their status', () => {
    window.localStorage.setItem(
      'todo.tasks',
      JSON.stringify([
        { id: 'task-1', title: 'Ship release', completed: true },
        { id: 'task-2', title: 'Write tests', completed: false },
      ]),
    );

    render(<Home />);

    expect(screen.getByText('Ship release')).toBeInTheDocument();
    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getAllByText(/completed|pending/i).length).toBeGreaterThan(0);
  });

  it('adds a task to state and persists it to localStorage', async () => {
    render(<Home />);

    const input = screen.getByLabelText(/task title/i);
    fireEvent.change(input, { target: { value: 'Write tests' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(screen.getByText('Write tests')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    const storedTasks = JSON.parse(window.localStorage.getItem('todo.tasks') ?? '[]');
    expect(storedTasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Write tests', completed: false }),
      ]),
    );
  });

  it('shows the empty state when no tasks exist', () => {
    render(<Home />);

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });
});
