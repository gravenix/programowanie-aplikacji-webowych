import App from './App';

const COLORS = [
    'red',
    'green',
    'blue',
    'orange',
    'yellow',
    'gray',
    'aqua',
    'pink',
]

class Note {
    private title :string = '';
    private content :string = '';
    private color :string = '';
    private pinned :boolean = false;
    private created :Date = new Date();

    private div :HTMLDivElement|null;

    private onDelete :(note :Note)=>void;
    private onChange :((note :Note)=>void);

    constructor(onDelete :(note :Note) => void, onChange :(note :Note) => void = () => {}, data :any = {}) {
        this.onDelete = onDelete;
        this.onChange = onChange;

        this.div = null;

        this.title = data.title ?? '';
        this.content = data.content ?? '';
        this.color = data.color ?? COLORS[Math.floor(Math.random()*COLORS.length-1)];
        this.pinned = data.pinned ?? false;
        this.created = data.created ?? new Date();
    }

    isPinned = () => this.pinned;
    togglePin = () => this.pinned = !this.pinned;

    render(): HTMLDivElement {
        this.div = document.createElement('div');
        this.div.className = "note";
        this.div.setAttribute('style', `background-color: ${this.color}`);

        let pin = document.createElement('span');
        pin.className = "pin" + (this.pinned ? ' pinned' : '');
        pin.innerHTML = 'Pin';
        pin.onclick = () => {
            this.togglePin();
            pin.className = "pin" + (this.pinned ? ' pinned' : '');
            this.onChange(this);
            App.getInstance().rebuildInterface();
        };
        this.div.appendChild(pin);

        let deleteSpan = document.createElement('span');
        deleteSpan.className = 'delete';
        deleteSpan.onclick = this.deleteClick;
        deleteSpan.innerHTML = '&#10006;';
        this.div.appendChild(deleteSpan);

        let title = document.createElement('input');
        title.value = this.title;
        title.placeholder = "Podaj tytuł...";
        title.onchange = (e :Event) => {
            this.title = (<HTMLInputElement>e.target).value;
            this.onChange(this);
        };
        this.div.appendChild(title);

        let content = document.createElement('textarea');
        content.value = this.content;
        content.onchange = (e :Event) => {
            this.content = (<HTMLTextAreaElement>e.target).value;
            this.onChange(this);
        }
        this.div.appendChild(content);

        let created = document.createElement('span');
        created.innerHTML = (new Date(this.created)).toLocaleString();
        created.className = 'created';
        this.div.appendChild(created);

        return this.div;
    }

    deleteClick = () =>
        confirm('Czy na pewno chcesz usunąć tę notatkę?') && this.onDelete(this);
    

    getJSON = (): any  => ({
        title: this.title,
        content: this.content,
        color: this.color,
        pinned: this.pinned,
        created: this.created
    })
}

export default Note;