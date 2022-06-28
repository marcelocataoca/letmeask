
import { render, screen } from '@testing-library/react';
import {Button} from '../../components/Button';
import '@testing-library/jest-dom';

describe("Testing button component", () => {
  it("should be able to find a button element", () => {
    render(<Button/>);
    const btnElement = screen.getByRole("button");

    expect(btnElement).toBeInTheDocument();
  })
})