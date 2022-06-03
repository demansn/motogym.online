import React from "react";
import {Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import {useTranslation} from "next-i18next";

export function DateInput(props) {
    const {
        sm,
        as,
        label,
        placeholder,
        id,
        value,
        onChange = () => {}
    } = props;
    const {t} = useTranslation();

    return (
        <Form.Group sm={sm} as={as} >
            <Form.Label>{t(label)}</Form.Label>
            <DatePicker
                id={'data-picker'}
                className='form-control'
                showPopperArrow={false}
                showMonthDropdown={true}
                showYearDropdown={true}
                selected={value}
                onChange={(value) => onChange(id, value)}
                placeholderText={t(placeholder)}
            />
        </Form.Group>
    );
}