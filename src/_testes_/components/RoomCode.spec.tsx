import { render, screen } from '@testing-library/react';
import { RoomCode } from '../../components/RoomCode';
import '@testing-library/jest-dom';

describe("Button to copy code room", () => {
  it("should be able to find a button copy", () => {
    render(<RoomCode code={'0930'}/>);
    const btnCode = screen.queryByRole('button');

    expect(btnCode).toBeInTheDocument();
  })
})