import { fireEvent, render, screen } from '@testing-library/react';
import CreateTaskForm from './CreateTaskForm';

describe('CreateTaskForm', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the task input and submit control with accessible labels', () => {
    render(<CreateTaskForm onAddTask={() => true} />);

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('calls onAddTask with a task when the form is submitted', () => {
    const onAddTask = jest.fn(() => true);
    render(<CreateTaskForm onAddTask={onAddTask} />);

    fireEvent.change(screen.getByLabelText(/task title/i), { target: { value: 'Write tests' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(onAddTask).toHaveBeenCalledTimes(1);
    expect(onAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Write tests',
        completed: false,
      }),
    );
    expect(screen.getByLabelText(/task title/i)).toHaveValue('');
  });

  it('shows a validation error when the title is empty or whitespace', () => {
    render(<CreateTaskForm onAddTask={() => true} />);

    const input = screen.getByLabelText(/task title/i);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/please enter a task title/i)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Valid task' } });
    expect(screen.queryByText(/please enter a task title/i)).not.toBeInTheDocument();
  });

  it('shows an error when the storage callback returns false', () => {
    render(<CreateTaskForm onAddTask={() => false} />);

    fireEvent.change(screen.getByLabelText(/task title/i), { target: { value: 'Saved task' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(screen.getByText(/unable to save task/i)).toBeInTheDocument();
  });

  it('uses crypto.randomUUID when available', () => {
    const originalCrypto = globalThis.crypto;

    try {
      Object.defineProperty(globalThis, 'crypto', {
        value: { randomUUID: jest.fn(() => 'uuid-123') },
        configurable: true,
      });

      const onAddTask = jest.fn(() => true);
      render(<CreateTaskForm onAddTask={onAddTask} />);

      fireEvent.change(screen.getByLabelText(/task title/i), { target: { value: 'UUID task' } });
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));

      expect(onAddTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'uuid-123',
          title: 'UUID task',
        }),
      );
    } finally {
      if (originalCrypto) {
        Object.defineProperty(globalThis, 'crypto', {
          value: originalCrypto,
          configurable: true,
        });
      }
    }
  });

  it('falls back to a timestamp-based task id when secure crypto APIs are unavailable', () => {
    const originalCrypto = globalThis.crypto;

    try {
      Object.defineProperty(globalThis, 'crypto', {
        value: {},
        configurable: true,
      });

      const onAddTask = jest.fn(() => true);
      render(<CreateTaskForm onAddTask={onAddTask} />);

      fireEvent.change(screen.getByLabelText(/task title/i), { target: { value: 'Fallback task' } });
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));

      const firstTask = (onAddTask.mock.calls as Array<Array<{ id?: string }>>)[0]?.[0];
      expect(firstTask).toBeDefined();
      expect(firstTask?.id).toMatch(/^task-/);
    } finally {
      if (originalCrypto) {
        Object.defineProperty(globalThis, 'crypto', {
          value: originalCrypto,
          configurable: true,
        });
      }
    }
  });
});
