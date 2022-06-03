import React, {Component} from 'react';
import classnames from 'classnames';
import Cleave from 'cleave.js/react';

const CleaveOptions = {
    numericOnly: true,
    delimiter: ':',
    blocks: [2, 2, 3],
};

export function TimeInputField(props) {
        const {
            name,
            value,
            label,
            error,
            info,
            onChange,
            disabled,
            className = '',
            type = 'text'
        } = props;

        return (
            <div className={`form-group ${className}`}>
                {label && <label>{label}</label>}
                <Cleave
                    options={CleaveOptions}
                    className={classnames('form-control', {'is-invalid': error})}
                    placeholder='00:00:000'
                    name={name}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={disabled}
                />
                {info && <small className="form-text text-muted">{info}</small>}
                {error && (<div className='invalid-feedback'>{error}</div>)}
            </div>
        );
}