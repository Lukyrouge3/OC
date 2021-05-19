export default class Terminal {

    el: HTMLElement;

    constructor(el: HTMLElement) {
        this.el = el;
        this.init();
    }

    init(): void {
        this.el.classList.add("terminal");
        let intro = this.el.appendChild(document.createElement("div"));
        intro.id = "intro";
        intro.innerHTML = "login as: anonymous<br>anonymous@localhost's password: *******<br><br>CustomOS<br><br>Welcome!<br>This server is not actually hosted<br/>$ ";
    }
}