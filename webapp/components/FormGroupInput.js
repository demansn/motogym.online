import React from "react";
import {Form} from "react-bootstrap";
import {useTranslation} from "next-i18next";
import {T} from "./T";

export function FormGroupInput(props) {
    const {
        as,
        label,
        placeholder,
        value,
        onChange,
        id,
        sm,
        type,
        error,
        mutedText,
        options = [],
        className = ''
    } = {onChange: () => {}, ...props};

    const onChangeValue = ({target}) => {
        switch (type) {
            case 'dropdown':
                if (target && options[target.selectedIndex - 1]) {
                    onChange(id, options[target.selectedIndex - 1].id);
                }
                break;
            default:
                onChange(id, target.value);
        }
    };

    const {t} = useTranslation();
    const formControl = () => {
        const as = type === 'textarea' ? 'textarea' : undefined;

        switch (type) {
            case 'dropdown':
                const defaultValue = 'default';
                const placeholderOption = <option key="default" value="default" disabled>{t(placeholder)}</option>;

                const dropdownOptions = options.map(opt => {
                    return <option key={opt.id} id={opt.id} value={opt.id}>{t(opt.label)}</option>;
                });

                dropdownOptions.unshift(placeholderOption);

                return <Form.Control
                    as="select"
                    value={value || defaultValue}
                    onChange={onChangeValue}
                    isInvalid={error}
                >{dropdownOptions}</Form.Control>;
            default:
                return (
                    <Form.Control
                        placeholder={t(placeholder)}
                        value={value}
                        onChange={onChangeValue}
                        isInvalid={error}
                        type={type}
                        as={as}
                    />
                );
        }
    };

    return (
        <Form.Group as={as} sm={sm} className={className} >
            <Form.Label>
                <T>{label}</T>
            </Form.Label>
            {formControl()}
            <Form.Control.Feedback type="invalid">
                <T>{error}</T>
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
                <T>{mutedText}</T>
            </Form.Text>
        </Form.Group>
    );
}