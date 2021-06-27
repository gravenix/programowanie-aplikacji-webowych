import '../styles.css';
import AppNotes from './AppNotes';
import AppStorage from './AppStorage';
import IAppStorage from './IAppStorage';
import Note from './Note';

class App {
    private appNotes :AppNotes
    private notesData :[];
    private storage :IAppStorage;
    private static _app :App;

    constructor() {
        App._app = this;
        this.storage = new AppStorage();

        let element = <HTMLDivElement>document.getElementsByClassName('content')[0];
        this.appNotes = new AppNotes(element, [], this.saveToLocalStorage());

        this.notesData = [];
        this.loadFromLocalStorage();
        this.appNotes.setNotes(this.generateNotes());

        let button = document.getElementById('add-new');
        if (button !== null) {
            button.onclick = () => this.onAddNote();
        }
    }

    rebuildInterface() {
        this.appNotes.renderNotes();
    }

    onAddNote() {
        this.appNotes.newNote();
    }

    loadFromLocalStorage() {
        let notes = this.storage.getNotes();
        if (notes !== null) {
            this.notesData = JSON.parse(notes);
        }
    }

    saveToLocalStorage = () => (data :any) => {
        this.storage.setNotes(JSON.stringify(data));
    }

    static getInstance = () => App._app;

    private generateNotes(): Note[] {
        return this.notesData.map(data => new Note(this.appNotes.onNoteDelete(), this.appNotes.onNoteUpdate(), data)).sort(note => note.isPinned() ? -1 : 0)
    }
}

document.addEventListener('DOMContentLoaded', () => new App());

export default App;