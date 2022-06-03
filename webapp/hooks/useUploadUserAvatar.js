import {useMutation} from "@apollo/client";
import gql from "graphql-tag";
import {useState} from "react";

const EDIT_USER_AVATAR = gql`
    mutation userAvatar($file: Upload!) {
        userAvatar(file: $file) {
            id
            profile {
                avatar
            }
        }
    }
`;

export const useUploadUserAvatar = () => {
    const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
    const [isUploading, setIsUploading] = useState(false);

    const upload = async (file) => {
        setIsUploading(true);
        const {data} = await editUserAvatar({variables: {file}});
        setIsUploading(false);

        return data.userAvatar.profile.avatar;
    };

    return {isUploading, upload};
};
