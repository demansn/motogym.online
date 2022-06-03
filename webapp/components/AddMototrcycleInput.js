import React, {Fragment, useState} from "react";
import {Row} from "react-bootstrap";
import {FormGroupInput, T} from "./index";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const FirstMotorcycleProductionYear = 1885;

export function AddMotorcycleInput({onClickAddMotorCycle}) {
    const NOW_YEAR = new Date().getFullYear();
    const optionsYears = [];

    let year = FirstMotorcycleProductionYear;

    while (year <= NOW_YEAR) {
        optionsYears.push({id: year, label: year});

        year += 1;
    }
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [productionYear, setProductionYear] = useState(NOW_YEAR.toString());
    const [notValidBrand, setNotValidBrand] = useState('');
    const [notValidModel, setNotValidModel] = useState('');

    const onClickAddMotorcycle = () => {
        setNotValidBrand('');
        setNotValidModel('');

        if (!model) {
            setNotValidModel('Motorcycle model required field');
        }

        if (!brand) {
            setNotValidBrand('Motorcycle brand required field');
        }

        if (!brand || !model) {
            return false;
        }

        if (!/[a-zA-Z0-9]/.test(model)) {
            setNotValidModel('It is possible to enter only numbers or symbols of the Latin alphabet in the field');
            return;
        }

        if (!/[a-zA-Z0-9]/.test(brand)) {
            setNotValidBrand('It is possible to enter only numbers or symbols of the Latin alphabet in the field');
            return;
        }

        onClickAddMotorCycle({brand, model, productionYear});
        setModel('');
        setBrand('');
        setProductionYear('');
    };

    return (
        <Fragment>
            <Row>
                <FormGroupInput
                    id="brand"
                    label="Brand"
                    placeholder="Enter brand"
                    as={Col}
                    value={brand}
                    onChange={(id, value) => setBrand(value)}
                    sm={4}
                    error={notValidBrand}
                />
                <FormGroupInput
                    id="model"
                    label="Model"
                    placeholder="Enter model"
                    as={Col}
                    value={model}
                    onChange={(id, value) => setModel(value)}
                    sm={4}
                    error={notValidModel}
                />
                <FormGroupInput
                    id="productionYear"
                    label="Production year"
                    placeholder="Enter production year"
                    as={Col}
                    value={productionYear}
                    options={optionsYears}
                    onChange={(id, value) => setProductionYear(value.toString())}
                    sm={4}
                    type={'dropdown'}
                />
            </Row>
            <Button className={'mt-2'} onClick={onClickAddMotorcycle} m={2}>
                <T>Add new motorcycle</T>
            </Button>
        </Fragment>
    );
}