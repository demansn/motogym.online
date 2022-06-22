import Col from "react-bootstrap/Col";
import {Button, Form, Row} from "react-bootstrap";
import countryRegionData from 'country-region-data/dist/data-umd';
import React, {useState} from "react";
import gql from "graphql-tag";
import {Loading} from "./Loading";
import {FormGroupInput} from "./FormGroupInput";
import {T} from "./T";
import {useTranslation} from "next-i18next";
import {useMutation} from "@apollo/client";

export const UpdateUserBioMutate = gql`
    mutation profile($profileInput: ProfileInput!) {
        profile(profileInput: $profileInput) {
            id
            profile {
                firstName
                lastName
                birthday
                gender
                country
                city
            }
        }
    }
`;

export function EditUserBio({userProfile = {}}) {
    const { t } = useTranslation();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [saveVisible, setSaveVisible] = useState(false);
    const [profileInput, setProfile] = useState({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        gender: userProfile.gender,
        birthday: userProfile.birthday,
        country: userProfile.country,
        city: userProfile.city
    });
    const [updateUserBio] = useMutation(UpdateUserBioMutate);
    const editProfile = (name, value) => {
        if (!saveVisible) {
            setSaveVisible(true);
        }

        setProfile({...profileInput, [name]: value});
    };

    const onSave = async () => {
        const errors = {};

        setErrors(errors);

        if (Object.keys(errors).length) {
            return;
        }

        setLoading(true);
        await updateUserBio({variables: {profileInput}});
        setLoading(false);
        setSaveVisible(false);
    };

    return (
        <Col sm={8} className='mt-2 mt-sm-0'>
            <Loading loading={loading}>
                <Form>
                    <Row>
                        <FormGroupInput
                            id='firstName'
                            label="First name"
                            placeholder="Enter first name"
                            as={Col}
                            value={profileInput.firstName}
                            onChange={editProfile}
                            error={errors.firstName}
                            sm={6}
                        />
                        <FormGroupInput
                            id="lastName"
                            label="Last name"
                            placeholder="Enter last name"
                            as={Col}
                            value={profileInput.lastName}
                            onChange={editProfile}
                            error={errors.lastName}
                            sm={6}
                        />
                    </Row>
                    <Row>
                        <Form.Group sm={6} as={Col} controlId="genderSelect">
                            <Form.Label>
                                <T>Gender</T>
                            </Form.Label>
                            <Form.Select
                                placeholder={t('Choose gender')}
                                value={profileInput.gender}
                                onChange={({target}) => editProfile("gender", target.value)}
                            >
                                <option value='' label={t('Choose gender')} />
                                <option value='male' label={t('Male')} />
                                <option value='female' label={t('Female')} />
                            </Form.Select>
                        </Form.Group>
                        <FormGroupInput
                            id="birthday"
                            label='Date of Birth'
                            as={Col}
                            value={profileInput.birthday}
                            onChange={editProfile}
                            sm={6}
                            type='date'
                        />
                    </Row>
                    <Row>
                        <Form.Group sm={6} as={Col} controlId="formGridState">
                            <Form.Label>
                                <T>Country</T>
                            </Form.Label>
                                <Form.Control
                                    as={Form.Select}
                                    value={profileInput.country}
                                    onChange={({target}) => editProfile("country", target.value)}
                                >
                                    <option value='' label={t('Select country')} />
                                    {countryRegionData.map(({countryName}) => {
                                        return <option key={countryName} value={countryName} label={countryName} />
                                    })}
                                </Form.Control>
                        </Form.Group>
                        <FormGroupInput
                            id="city"
                            label='City'
                            placeholder='Enter city'
                            as={Col}
                            value={profileInput.city}
                            error={errors.city}
                            onChange={editProfile}
                            sm={6}
                        />
                    </Row>
                    <Button className={'mt-2'} variant="primary" hidden={!saveVisible} onClick={onSave}>
                        <T>Save</T>
                    </Button>
                </Form>
            </Loading>
        </Col>
    );
}
