import {useNavigate, useParams} from "react-router-dom";
import {Loading, SimpleForm, TextInput, Title, useGetOne, useUpdate} from "react-admin";
import {Card} from "@mui/material";

export const CompetitionEdit = () => {
    const { id } = useParams();
    const { isLoading, data } = useGetOne("competitions", { id });
    const [update] = useUpdate();
    const navigate = useNavigate();
    const onSubmit = (data) => {
        update(
            "competitions",
            { id, data },
            { onSuccess: () => { navigate('/competitions'); } }
        );
    };

    if (isLoading) return <Loading />

    return (
        <div>
            <Title title="Competitions Edition" />
            <Card>
                <SimpleForm record={data} onSubmit={onSubmit}>
                    <TextInput source="name" label="name" />
                </SimpleForm>
            </Card>
        </div>
    );
}
