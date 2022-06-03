import React, {createRef} from "react";
import {Button, ButtonToolbar, Form, Image} from "react-bootstrap";
import {useDropzone} from "react-dropzone";
import {T} from "./T";
import racetrackIcon from "public/images/racetrack-icon.png";

export function RacetrackInput({id, value, label = 'Racetrack of competition', error, onChange = () => {}, className, sm, as}) {
    const dropZoneRef = createRef();
    const openDialog = () => {
        if (dropZoneRef.current) {
            dropZoneRef.current.open();
        }
    };
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: ([file]) => onChange(id, file)
    });
    const preview = (value && URL.createObjectURL(value)) || '';
    const icon = <Image src={racetrackIcon} width={200} height={200} alt={'racetrack-icon'} className='racetrack-icon' />;
    const map = <Image width={200} height={200} alt={'racetrack'} src={preview} className='racetrack-image' />;

     return (
         <Form.Group className={`racetrack-input ${className || ''} ${error && 'is-invalid'}`} sm={sm} as={as} >
             <label>
                 <T>label</T>
             </label>
             <div className='racetrack-image-container'>{preview ? map : icon}</div>
             <div {...getRootProps()}>
                 <input {...getInputProps()} />
                 <ButtonToolbar >
                     <Button variant="secondary" className={'w-100'} onClick={openDialog} >
                         <T>Select image of racetrack</T>
                     </Button>
                 </ButtonToolbar>
             </div>
             <div className="invalid-feedback">{error}</div>
        </Form.Group >
    );
}