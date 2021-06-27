import Note from "./Note";

class AppNotes {
    private base :HTMLDivElement;
    private notes :Note[];
    private saveNotes :(json :any) => void;

    constructor(content :HTMLDivElement, notes :Note[] = [], save :(json :any) => void) {
        this.base = content;
        this.notes = notes;
        this.renderNotes();
        this.saveNotes = save;
    }

    setNotes(notes :Note[]) {
        this.notes = notes;
        this.renderNotes();
    }

    newNote() {
        this.notes.push(new Note(this.onNoteDelete(), this.onNoteUpdate()));
        this.renderNotes();
        this.save();
    }

    onNoteDelete = () => (note: Note) => {
        this.notes = this.notes.filter(n => n !== note);
        this.save();
        this.renderNotes();
    }

    onNoteUpdate = () => (note :Note) => {
        
        this.save();
    }

    renderNotes() {
        this.base.innerHTML = '';
        this.sort();
        this.notes.forEach(note => {
            this.base.appendChild(note.render());
        });
    }

    private sort = () => this.notes = this.notes.sort(note => note.isPinned() ? -1 : 0);

    private save = () => this.saveNotes(this.notes.map(n => n.getJSON()))
}

export default AppNotes;