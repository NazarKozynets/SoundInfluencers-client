export const generateMongoObjectId = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16); 
    const randomHex = 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
        (Math.floor(Math.random() * 16)).toString(16)
    ); 
    return timestamp + randomHex;
};
