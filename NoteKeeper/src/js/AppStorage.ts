import IAppStorage from "./IAppStorage";

const KEY :string = 'notes';

class AppStorage implements IAppStorage {
    private storage :Storage;

    constructor() {
        this.storage = window.localStorage;
    }

    getNotes = () => this.storage.getItem(KEY)

    setNotes(notes :any) {
        this.storage.setItem(KEY, notes);
        return true;
    }
}

export default AppStorage;