import {gql} from "@apollo/client";
import {Col, Container, Row} from "react-bootstrap";
import {LineTitle, T} from "@components";
import {EditUserAvatar} from "components/EditUserAvatar";
import withAppContext from "lib/withAppContext";
import {EditUserBio} from "../components/EditUserBio";
import {EditMotorcycles} from "../components/EditMotorcycles";

export default function EditUserProfilePage({user}) {
    return (
        <Container className="h-100" >
            <h1 className="text-center">
                <T>Edit profile</T>
            </h1>
            <Row >
                <Col className={'col-12'}>
                    <LineTitle >
                        <T>Bio</T>
                    </LineTitle>
                </Col>
                <EditUserAvatar user={user}/>
                <EditUserBio userProfile={user.profile} />
            </Row>
            <Row>
                <EditMotorcycles motorcycles={user.motorcycles} />
            </Row>
        </Container>
    );
}

const DATA_FOR_EDIT_USER_PROFILE = gql`
    query dataForEditProfile {
        me {
            id
            profile {
                avatar
                firstName
                lastName
                birthday
                gender
                age
                country
                city
            }
            motorcycles {
                id
                productionYear
                model
                name
                brand
            }
        }
    }
`;

export const getServerSideProps = withAppContext({
    callback: async ({apolloClient}) => {
        const {data} = await apolloClient.query({query: DATA_FOR_EDIT_USER_PROFILE});
        const {me: user} = data;

        return {
            props: {
                user
            }
        };
    }
});