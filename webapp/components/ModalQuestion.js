import {Button, Modal} from "react-bootstrap";
import {T} from "./T";
import React, {createContext, useContext, useState} from "react";

const modalQuestionContext = createContext();

export function useModalQuestion() {
    return useContext(modalQuestionContext);
}

const useProvideModalQuestion = () => {
    const [state, setState] = useState({
        title: '',
        body: '',
        confirm:() => {},
        cancel:() => {}
    });
    const [visible, setVisible] = useState(false);

    const show = ({title, body, confirm = () => {}, cancel = () => {}}) => {
        setState(() => ({...state, title, body, confirm, cancel}));
        setVisible(true);
    };

    const hide = () => {
        setState({ title: '', body: '', confirm: () => {}, cancel: () => {}});
        setVisible(false);
    };

    return {...state, visible, show, hide};
};

export function ModalQuestionProvider({ children }) {
    const modalQuestion = useProvideModalQuestion();

    return (
        <modalQuestionContext.Provider value={modalQuestion}>
            {children}
        </modalQuestionContext.Provider>
    );
}

export function ModalQuestion() {
    const modalQuestion = useModalQuestion();

    const onClickYes = () => {
        modalQuestion.confirm();
        modalQuestion.hide();
    };
    const onClickNo = () => {
        modalQuestion.cancel();
        modalQuestion.hide();
    };

    return (
            <Modal
                show={modalQuestion.visible}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={onClickNo}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className='text-danger'>
                        <T>{modalQuestion.title}</T>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <T>{modalQuestion.body}</T>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClickYes}>
                        <T>Yes</T>
                    </Button>
                    <Button onClick={onClickNo}>
                        <T>No</T>
                    </Button>
                </Modal.Footer>
            </Modal>
    );
}