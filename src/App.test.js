import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import CharacterSheet from './components/CharacterSheet';

test('check functionality of Add new btn', () => {
  render(<App />);
  expect(screen.getByRole("button", { name: /Add New Character/ })).toBeInTheDocument();
  expect(screen.getAllByTestId('character-sheet')).toHaveLength(1)
  const button = screen.getByRole("button", { name: /Add New Character/ })
  fireEvent.click(button);
  expect(screen.getAllByTestId('character-sheet')).toHaveLength(2)
});


test('Check +/- button on attribute', () => {
  render(<App />);


  // check clicking on plus increase  attribute and modifier score
  expect(screen.getByTestId('attribute-score-0')).toHaveTextContent(0);
  expect(screen.getByTestId('attribute-modifier-0')).toHaveTextContent(0);


  const button = screen.getByTestId('add-attribute-0')

  fireEvent.click(button)

  expect(screen.getByTestId('attribute-score-0')).toHaveTextContent(1)
  expect(screen.getByTestId('attribute-modifier-0')).toHaveTextContent(-5);


  // check clicking on - decrease  score

  const minusBtn = screen.getByTestId('subtract-attribute-0')

  fireEvent.click(minusBtn)

  expect(screen.getByTestId('attribute-score-0')).toHaveTextContent(0)

  fireEvent.click(minusBtn)

  expect(screen.getByTestId('attribute-score-0')).toHaveTextContent(-1)
  expect(screen.getByTestId('attribute-modifier-0')).toHaveTextContent(-6);

  //check attribute modifier score is updated accordingly

})

test('check +/- of attribute update skill modifiers accordingly', () => {
  render(<App />);

  expect(screen.getByTestId('attribute-score-0')).toHaveTextContent(0);


  const button = screen.getByTestId('add-attribute-0')

  fireEvent.click(button)
  fireEvent.click(button)

})
