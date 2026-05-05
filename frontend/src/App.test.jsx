import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders brand name', () => {
  render(<App />);
  const brandElement = screen.getByText(/Arslan DevOps/i);
  expect(brandElement).toBeInTheDocument();
});