import * as React from "react";
import {List, Datagrid, TextField, EmailField, EditButton, DeleteButton} from 'react-admin';

export const CompetitionsList = () => (
    <List pagination={false} >
        <Datagrid bulkActionButtons={false}>
            <TextField source="id" />
            <EmailField source="name" />
            <EditButton />
            <DeleteButton mutationMode="pessimistic" />
        </Datagrid>
    </List>
);
