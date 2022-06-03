import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import {useTranslation} from "next-i18next";

export function FormGroupRadioInput(props) {
    const {
        as,
        label,
        value,
        onChange = () => {},
        id,
        sm,
        options
    } = props;
    const [editValue, setValue] = useState(value);
    const {t} = useTranslation();

    useEffect(() => {
        onChange(id, editValue);
    }, [editValue]);

    return (
        <Form.Group as={as} sm={sm} >
            <Form.Label>
                {t(label)}
            </Form.Label>
            {
                options.map(opt => {
                    return <Form.Check
                        onChange={() => setValue(opt.id)}
                        type="radio"
                        checked={opt.id === value}
                        label={t(opt.label)}
                        name={opt.id}
                        id={opt.id}
                        key={opt.id}
                    />;
                })
            }
        </Form.Group>
    );
}