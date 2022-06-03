import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {
    CompetitionNavTabs,
    FormGroupInput,
    T,
    TimeInputField
} from "@components";
import {gql, useMutation} from "@apollo/client";
import {useTranslation} from "next-i18next";
import {useState} from "react";
import withAppContext from "lib/withAppContext";

export default function AddResultCompetitionPage({user, competition}) {
    const {motorcycles: userMotorcycles} = user;
    const {t} = useTranslation();
    const [motorcycleID, setMotorcycle] = useState(userMotorcycles[0].id);
    const [status, setStatus] = useState('');
    const [addResult] = useMutation(ADD_RESULT);
    const [time, setTimeResult] = useState('');
    const [video, setVideo] = useState('');
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});
    const motorcycles = userMotorcycles.map(({id, brand, model}) => ({label: `${brand} ${model}`, id}));

    const {name, id: competitionID} = competition;

    const onClickSubmit = () => {
        setErrors({});
        setStatus('');

        if (!motorcycleID) {
            setErrors({motorcycle: 'Motorcycle required field'});
            return false;
        }

        if (!time) {
            setErrors({time: 'Time result required field'});
            return false;
        }

        const resultInput = {
            competitionID,
            motorcycleID,
            time,
            video,
            date
        };

        addResult({variables: {resultInput}}).then(({data}) => {
            if (data.addResult) {
                setStatus('success');
            } else {
                setStatus('error');
            }

            setTimeResult('');
            setDate('');
            setVideo('');
            setErrors('');
        });
    };

    return (
        <Container className="h-100" >
                <div className="">
                    <CompetitionNavTabs competitionId={competition.id} competitionType={competition.type.name} />
                    <br/>
                    <Form>
                        <Row>
                            <ResultMessage status={status}/>
                            <FormGroupInput
                                options={motorcycles}
                                value={motorcycleID}
                                onChange={(e, v) => setMotorcycle(v)}
                                error={errors && errors['type']}
                                id='motorcycle'
                                label="The motorcycle that participated in this competition"
                                placeholder="Select a bike"
                                type='dropdown'
                                as={Col}
                                sm={12}
                                className={'mb-3'}
                            />
                            <TimeInputField
                                className='col-12' type='text' name='timeResult' label={t("Time result")}
                                onChange={setTimeResult} value={time} error={errors && errors.time}
                            />
                            <FormGroupInput
                                id='video'
                                label={'Link to video result'}
                                placeholder={'Enter the link to the video result'}
                                mutedText={'If you don’t add a link to the video of the result, then this result will not be added to the table of general results of this competition, the result will be visible only in your profile'}
                                value={video}
                                error={errors && errors['video']}
                                onChange={(_, value) => setVideo(value)}
                                as={Col}
                                sm={12}
                                className={'mb-3'}
                            />
                            <FormGroupInput
                                id='date'
                                label={t('Date of Result')}
                                placeholder={t('Date of Result')}
                                value={date}
                                error={errors && errors['date']}
                                onChange={(e, v) => setDate(v)}
                                as={Col}
                                sm={12}
                                type={'date'}
                                className={'mb-3'}
                            />
                        </Row>
                        <Button variant="primary" className='col-sm-12' onClick={onClickSubmit} >
                            <T>Submit</T>
                        </Button>
                    </Form>
                </div>
        </Container>
    );
}

function ResultMessage({status}) {
    if (status === 'success') {
        return <SuccessMessage />;
    } else if (status === 'error') {
        return <FailureMessage />;
    }

    return null;
}

function SuccessMessage() {
    return (
        <div className="alert alert-success">
            <h1>
                <T>Congratulations</T>
            </h1>
            <p>
                <T>You have successfully submitted the result</T>
            </p>
        </div>
    );
}

function FailureMessage() {
    return (
        <div className="alert alert-danger">
            <h1 className='text-danger'>
                <T>Failure</T>
            </h1>
            <p>
                <T>Unfortunately, something went wrong, the result was not sent</T>
            </p>
            <p>
                <T>Try again</T>
            </p>
        </div>
    );
}

const DATA_FOR_ADD_RESULT_COMPETITION = gql`
    query dataForAddResultCompetition($id: ID!) {
        me {
            id
            motorcycles {
                id
                brand
                model
            }
        }
        competition(id: $id) {
            id
            name
            type {
                name
            }
            description {
                en
                ru
                ua
                ja
            }
            racetrack
        }
    }
`;

const ADD_RESULT = gql`
    mutation addResult($resultInput: ResultInput!) {
        addResult(resultInput: $resultInput) {
            id
            date
            time
            totalTime
            fine
            video
            user {id}
            motorcycle {brand model}
        }
    }
`;

export const getServerSideProps = withAppContext({
    accessLevel: 'user',
    callback: async ({apolloClient, query}) => {
        const {data} = await apolloClient.query({query: DATA_FOR_ADD_RESULT_COMPETITION, variables: {id: query.id}});
        const {me: user, competition} = data;

        return {
            props: {
                user,
                competition
            }
        };
    }
});