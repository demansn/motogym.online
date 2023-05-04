export const NodeResolver = {
    id: (parent) => {
        console.log(parent);

        return parent._id.toString();
    }
};
