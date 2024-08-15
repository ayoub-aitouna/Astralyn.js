export const ARRAY_DIFF_OP = {
    ADD: 'add',
    REMOVE: 'remove',
    MOVE: 'move',
    NOOP: 'noop'
}

class ArrayWithOriginalIndices {
    #array: any[] = [];
    #originalIndices: number[] = [];
    #equalFn

    constructor(array: any[], equalFn: any) {
        this.#array = [...array];
        this.#originalIndices = array.map((_, i) => i)
        this.#equalFn = equalFn
    }

    get_length() {
        return this.#array.length;
    }

    isRemoval(index: number, newArray: any[]) {
        if (index >= this.#array.length)
            return false;
        const item = this.#array[index]
        const indexInNewArray = newArray.findIndex((newItem) => this.#equalFn(item, newItem))
        return indexInNewArray === -1;
    }

    removeItem(index: number) {
        const operation = {
            op: ARRAY_DIFF_OP.REMOVE,
            index,
            item: this.#array[index]
        }
        this.#array.splice(index, 1)
        this.#originalIndices.splice(index, 1)
        return operation;
    }

    isNoop(index: number, newArray: any[]) {
        if (index >= this.#array.length)
            return false;
        return this.#equalFn(this.#array[index], newArray[index])
    }

    noopItem(index: number) {
        return {
            op: ARRAY_DIFF_OP.NOOP,
            originalIndex: this.#originalIndices[index],
            index,
            item: this.#array[index],
        }
    }

    isAddition(item: any, fromIdx: number) {
        return this.findFromIndex(fromIdx, item) === -1;
    }

    findFromIndex(index: number, item: any) {
        return this.#array.findIndex((_, i) => i >= index && this.#equalFn(_, item))
    }

    addItem(index: number, item: any) {
        const operation = {
            op: ARRAY_DIFF_OP.ADD,
            index,
            item
        }
        this.#array.splice(index, 0, item) // add item to array at index
        this.#originalIndices.splice(index, 0, -1) // because it's new item and it doesn't have original index
        return operation;
    }

    moveItem(item: any, toIndex: number) {
        const fromIdx = this.findFromIndex(toIndex, item);
        const operation = {
            op: ARRAY_DIFF_OP.MOVE,
            from: fromIdx,
            index: toIndex,
            originalIndex: this.#originalIndices[fromIdx],
            item: this.#array[fromIdx],

        }
        // remove item from fromIdx and add it to toIndex
        const [_item] = this.#array.splice(fromIdx, 1);
        this.#array.splice(toIndex, 0, _item);

        // remove original index from fromIdx and add it to toIndex
        const [_originalIndex] = this.#originalIndices.splice(fromIdx, 1);
        this.#originalIndices.splice(toIndex, 0, _originalIndex);

        return operation;
    }

}

export function withoutNulls(children: Array<any>) {
    return children.filter((item) => item != null)
}


export function ArrayDiff(oldArray: any[], newArray: any[]) {
    // TODO: get index of added/removed element 
    return {
        added: newArray.filter(item => !oldArray.includes(item)),
        removed: oldArray.filter(item => !newArray.includes(item)),
    }
}

export function arraysDiffSequence(oldArray: any[], newArray: any[], equalFn = (a: any, b: any) => a === b) {
    const sequence: any[] = []
    const array = new ArrayWithOriginalIndices(oldArray, equalFn);
    for (let index = 0; index < newArray.length; index++) {
        if (array.isRemoval(index, newArray)) {
            sequence.push(array.removeItem(index))
            index--;
            continue
        }
        if (array.isNoop(index, newArray)) {
            sequence.push(array.noopItem(index));
            continue
        }
        if (array.isAddition(newArray[index], index)) {
            sequence.push(array.addItem(index, newArray[index]))
            continue
        }
        sequence.push(array.moveItem(newArray[index], index))
    }

    // remove remaining items in oldArray
    for (let index = newArray.length; index < array.get_length(); index++) {
        sequence.push(array.removeItem(index))
    }

    return sequence;
}




export function applyArraysDiffSequence(oldArray: any[], diffSeq: any[]) {
    return diffSeq.reduce((array, { op, item, index, from }) => {
        switch (op) {
            case ARRAY_DIFF_OP.ADD:
                array.splice(index, 0, item)
                break;
            case ARRAY_DIFF_OP.REMOVE:
                array.splice(index, 1)
                break;
            case ARRAY_DIFF_OP.MOVE:
                const [_item] = array.splice(from, 1);
                array.splice(index, 0, _item);
                break;
        }
        return array;
    }, oldArray)
}
