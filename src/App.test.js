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
  expect(screen.getByTestId('attribute-score-for-Strength')).toHaveTextContent(0);
  expect(screen.getByTestId('attribute-modifier-for-Strength')).toHaveTextContent(0);


  const button = screen.getByTestId('add-attribute-btn-Strength')

  fireEvent.click(button)

  expect(screen.getByTestId('attribute-score-for-Strength')).toHaveTextContent(1)
  expect(screen.getByTestId('attribute-modifier-for-Strength')).toHaveTextContent(-5);


  // check clicking on - decrease  score
  const minusBtn = screen.getByTestId('subtract-attribute-btn-Strength')
  fireEvent.click(minusBtn)

  expect(screen.getByTestId('attribute-score-for-Strength')).toHaveTextContent(0)

  fireEvent.click(minusBtn)

  expect(screen.getByTestId('attribute-score-for-Strength')).toHaveTextContent(-1)
  expect(screen.getByTestId('attribute-modifier-for-Strength')).toHaveTextContent(-6);

})

test('check +/- of attribute update skill modifiers accordingly', () => {
  render(<App />);

  expect(screen.getByTestId('attribute-score-for-Strength')).toHaveTextContent(0);
  expect(screen.getByTestId('attribute-modifier-for-Strength')).toHaveTextContent(0);
  const button = screen.getByTestId('add-attribute-btn-Strength')
  fireEvent.click(button)
  expect(screen.getByTestId('attribute-modifier-for-Strength')).toHaveTextContent(-5);

  expect(screen.getByTestId('skill-modifier-score-Strength')).toHaveTextContent(-5)

  expect(screen.getByTestId('skill-modifier-score-Strength')).toEqual(screen.getByTestId('skill-modifier-score-Strength'))


})
