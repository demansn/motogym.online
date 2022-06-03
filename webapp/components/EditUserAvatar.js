import {createRef, useCallback, useState} from "react";
import {Button, ButtonToolbar, Col} from "react-bootstrap";
import {T} from "./T";
import {useDropzone} from "react-dropzone";
import {useUploadUserAvatar} from "hooks/useUploadUserAvatar";
import {ResponsiveImage} from "./ResponsiveImage";
import avatarIcon from "public/images/avatar-icon.png";

export function EditUserAvatar({user}) {
    const [avatar, setAvatar] = useState(user.profile.avatar || avatarIcon);
    const {isUploading, upload} = useUploadUserAvatar();
    const dropzoneRef = createRef();
    const openDialog = () => {
        if (dropzoneRef.current) {
            dropzoneRef.current.open();
        }
    };

    const onDrop = useCallback(async ([file]) => {
        const newAvatar = await upload(file);

        setAvatar(newAvatar);
    }, []);
    const {getRootProps, getInputProps} = useDropzone({onDrop, accept: {'image/*': ['.png', '.jpg', '.webp'],}});

    return (
        <Col sm={4}  >
            <ResponsiveImage src={avatar} alt={'avatar'} />
            <div {...getRootProps()} className={'mt-2'}>
                <input {...getInputProps()} />
                <ButtonToolbar>
                    <Button variant="secondary" className={'w-100'} onClick={openDialog} disabled={isUploading}>
                        {isUploading ? <T>Loading</T> : <T>Edit</T>}
                    </Button>
                </ButtonToolbar>
            </div>
        </Col>
    );
}