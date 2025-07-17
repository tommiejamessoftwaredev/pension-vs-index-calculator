import { render } from '@testing-library/react';
import App from './App';

test('renders pension calculator app', () => {
  render(<App />);
  expect(document.body).toBeInTheDocument();
});
