import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {useGetOne, useUpdate, Title, BooleanInput, SimpleForm, TextInput} from "react-admin";
import {Card} from "@mui/material";

export const DriverEdit = () => {
    const { id } = useParams();
    const { isLoading, data } = useGetOne("drivers", { id });
    const [update, { isLoading: isSubmitting }] = useUpdate();
    const navigate = useNavigate();
    const onSubmit = (data) => {
        update(
            "drivers",
            { id, data },
            { onSuccess: () => { navigate('/drivers'); } }
        );
    };

    if (isLoading) return null;

    return (
        <div>
            <Title title="Driver Edition" />
            <Card>
                <SimpleForm record={data} onSubmit={onSubmit}>
                    <TextInput source="email" label="email" />
                    <BooleanInput source="isVerified" name="isVerified" label="isVerified" />
                    <TextInput source="profile.firstName" name="firstName" label="firstName" />
                    <TextInput source="profile.lastName" name="lastName" label="lastName" />
                    <TextInput source="profile.country" name="country" label="country" />
                    <TextInput source="profile.city" name="city" label="city" />
                </SimpleForm>
            </Card>
        </div>
    );
};
