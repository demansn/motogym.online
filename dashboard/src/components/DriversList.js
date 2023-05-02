import * as React from "react";
import { List, Datagrid, TextField, EmailField, EditButton } from 'react-admin';

import { FunctionField } from 'react-admin';

export const DriversList = () => (
    <List pagination={false} >
        <Datagrid bulkActionButtons={false}>
            <TextField source="id" />
            <EmailField source="email" />
            <FunctionField
                label="Name"
                render={record => `${record.profile.firstName} ${record.profile.lastName}`}
            />
            <FunctionField
                label="From"
                render={record => `${record.profile.country} ${record.profile.city}`}
            />;
            <EditButton />
        </Datagrid>
    </List>
);
