interface IAppStorage {
    setNotes: (notes :any) => boolean;
    getNotes: () => any,
}

export default IAppStorage;