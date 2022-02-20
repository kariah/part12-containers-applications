import { render, screen } from '@testing-library/react';
import ToDo from './ToDo'

test('renders todo text', () => {
    render(<ToDo todo={'TestTodo'} info={'InfoText'} />); 
    const textElement = screen.getByText(/InfoText/); 
    expect(textElement).toBeInTheDocument();
  });
  