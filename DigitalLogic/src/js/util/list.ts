export default class List<T> {
    protected items: Array<T>;

    constructor(items?) {
        if (items) this.items = items;
        else this.items = [];
    }

    get length(): number {
        return this.items.length;
    }

    add(value: T): void {
        this.items.push(value);
    }

    get(index: number): T {
        return this.items[index];
    }

    remove(item: T): void {
        for (let i = 0; i < this.length; i++) {
            if (this.get(i) === item) this.items.splice(i, 1);
        }
    }

    foreach(func: (e: T, i: number) => any): void {
        for (let i = 0; i < this.length; i++) {
            func(this.items[i], i);
        }
    }

    clear(): void {
        this.items = [];
    }


}