import { render, screen } from '@testing-library/react';
import { RoomCode } from '../../components/RoomCode';
import '@testing-library/jest-dom';
import copyImg from "../assets/images/copy.svg";


describe("Button to copy code room", () => {
  it("should be able to find a button copy", () => {
    render(<RoomCode code={'0930'}/>);
    const btnCode = screen.queryByRole('button');
    const image = screen.getAllByAltText('Go copy code');

    expect(btnCode).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  })
})