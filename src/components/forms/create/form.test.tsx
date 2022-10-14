import {cleanup, fireEvent, render} from '@testing-library/react';
// import axios from 'axios';
import {Form} from './form';

afterEach(cleanup);

const testName = 'Artem';
const testPhone = '38096 777 22 55';

jest.mock('axios')

test('form', () => {
    const {queryByLabelText, getByTestId} = render(<Form onSubmit={() => {}}/>);
    const name = getByTestId(/form-field-name/i)
    const phone = getByTestId(/form-field-phone/i)
    fireEvent.paste(name, testName)
    fireEvent.paste(phone, testPhone)

    fireEvent.click(getByTestId(/submit-form/i));

    expect(queryByLabelText(/on/i)).toBeTruthy();
})
