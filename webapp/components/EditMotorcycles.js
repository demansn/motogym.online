import React, {useState} from "react";
import {useModalQuestion} from "./ModalQuestion";
import {gql, useMutation} from "@apollo/client";
import {LineTitle} from "./LineTitle";
import {CloseButton, Col, ListGroup, Row} from "react-bootstrap";
import {AddMotorcycleInput} from "./AddMototrcycleInput";
import {T} from "./T";

export const EditMotorcycle = gql`
    mutation motorcycle($motorcycleInput: MotorcycleInput!) {
        motorcycle(motorcycleInput: $motorcycleInput) {
            id
            brand
            model
            productionYear
        }
    }
`;

export const RemoveMotorcycle = gql`
    mutation removeMotorcycle($id: String!) {
        removeMotorcycle(id: $id)
    }
`;

const Motorcycle = ({id, brand, model, productionYear}, onClick) => {
    return (
        <ListGroup.Item key={id} >
            <Row>
                <Col xs={11}>{brand} {model}</Col>
                <Col xs={1}><CloseButton onClick={() => onClick(id)}/></Col>
            </Row>
        </ListGroup.Item>
    );
};

export function EditMotorcycles({motorcycles = []}) {
    const [userMotorcycles, setUserMotorcycles] = useState(motorcycles);
    const {show} = useModalQuestion();

    const [editMotorcycle] = useMutation(EditMotorcycle);
    const [removeMotorcycle] = useMutation(RemoveMotorcycle);

    const addMotorcycle = async ({brand, model, productionYear}) => {
       const {data} = await editMotorcycle({variables:{motorcycleInput: {brand, model, productionYear}}});
       setUserMotorcycles([...userMotorcycles, data.motorcycle]);
    };

    const removeUserMotorcycle = async (removeMotorcycleID) => {
        await removeMotorcycle({variables: {id:removeMotorcycleID}});

        setUserMotorcycles(userMotorcycles.filter(({id}) => id !== removeMotorcycleID));
    };

    const deleteMotorcycle = async (id) => {
        const modal = {
            title: 'Are you sure you want to remove the motorcycle',
            body: 'If you remove the motorcycle, then you can no longer use it to submit competition results',
            confirm: () => removeUserMotorcycle(id)
        };

        show(modal);
    };

    return (
        <Col>
            <LineTitle ><T>Motorcycles</T></LineTitle>
            <ListGroup variant="flush">
                {userMotorcycles.map((motorcycle) => Motorcycle(motorcycle, deleteMotorcycle))}
            </ListGroup>
            <br/>
            <AddMotorcycleInput onClickAddMotorCycle={addMotorcycle}/>
        </Col>
    );
}