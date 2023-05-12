import {Loading, useGetList, Error, SelectInput} from "react-admin";

export const CompetitionsTypesInput = ({source, name}) => {
    const { data: types = [], isLoading, error } = useGetList('competitionsTypes');

    if (isLoading) return <Loading />;
    if (error) return <Error error={error.toString()}/>;

    return <SelectInput source={source} name={name} choices={types} />
};
