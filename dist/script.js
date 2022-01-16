"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const frame = document.querySelector('.frame');
const insertionSortBtn = document.querySelector('#insertion-sort-btn');
const selectionSortBtn = document.querySelector('#selection-sort-btn');
const heapSortBtn = document.querySelector('#heap-sort-btn');
const mergeSortBtn = document.querySelector('#merge-sort-btn');
const quickSortBtn = document.querySelector('#quick-sort-btn');
const btnContainer = document.querySelector('.btn-container');
var Colors;
(function (Colors) {
    Colors[Colors["RED"] = 0] = "RED";
    Colors[Colors["GREEN"] = 1] = "GREEN";
    Colors[Colors["YELLOW"] = 2] = "YELLOW";
    Colors[Colors["BLUE"] = 3] = "BLUE";
})(Colors || (Colors = {}));
const numberOfBars = 60;
const barWidth = 1.5;
let sortStarted = false;
/********************************************************
 *                    Initial SetUp
 *********************************************************/
populateFrame();
/********************************************************
 *                    Event listeners
 *********************************************************/
insertionSortBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (sortStarted)
        resetFrame();
    btnContainer.classList.add('hide');
    yield insertionSort();
    btnContainer.classList.remove('hide');
    sortStarted = true;
}));
selectionSortBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (sortStarted)
        resetFrame();
    btnContainer.classList.add('hide');
    yield selectionSort();
    btnContainer.classList.remove('hide');
    sortStarted = true;
}));
heapSortBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (sortStarted)
        resetFrame();
    btnContainer.classList.add('hide');
    yield heapSort();
    btnContainer.classList.remove('hide');
    sortStarted = true;
}));
mergeSortBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (sortStarted)
        resetFrame();
    btnContainer.classList.add('hide');
    yield mergeSort();
    btnContainer.classList.remove('hide');
    sortStarted = true;
}));
quickSortBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (sortStarted)
        resetFrame();
    btnContainer.classList.add('hide');
    yield quickSort();
    btnContainer.classList.remove('hide');
    sortStarted = true;
}));
/********************************************************
 *                   Sorting Algorithms
 *********************************************************/
function partition(low, high) {
    return __awaiter(this, void 0, void 0, function* () {
        const pivot = getElementHeight(high);
        let i = (low - 1);
        changeColor(high, Colors.YELLOW);
        for (let j = low; j <= high - 1; j++) {
            if (getElementHeight(j) < pivot) {
                i++;
                yield swapAndSleep(i, j);
            }
        }
        changeColorToDefault(high);
        yield swapAndSleep(i + 1, high);
        return (i + 1);
    });
}
function quickSort(low = 0, high = numberOfBars - 1) {
    return __awaiter(this, void 0, void 0, function* () {
        if (low < high) {
            const pi = yield partition(low, high);
            yield quickSort(low, pi - 1);
            yield quickSort(pi + 1, high);
        }
        if (low === 0 && high === numberOfBars - 1) {
            for (let i = 0; i < numberOfBars; i++) {
                yield sleep(5);
                changeColor(i, Colors.GREEN);
            }
        }
    });
}
function mergeSort() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mergeSorthelper();
        for (let i = 0; i < numberOfBars; i++) {
            changeColorToDefault(i);
            yield sleep(5);
            changeColor(i, Colors.GREEN);
        }
    });
}
function mergeSorthelper(a = 0, b = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (b === null)
            b = numberOfBars;
        if (b - a > 1) {
            const center = Math.floor((b + a + 1) / 2);
            yield mergeSorthelper(a, center);
            yield mergeSorthelper(center, b);
            const left = sliceOfFrame(a, center);
            const right = sliceOfFrame(center, b);
            let i = 0;
            let j = 0;
            while (b > a) {
                const bars = document.querySelectorAll('.bar');
                yield sleep(20);
                if ((j >= right.length) || (i < left.length && left[i] < right[j])) {
                    bars[a].setAttribute('style', `height: ${left[i]}%; width: ${barWidth}%;`);
                    i++;
                }
                else {
                    bars[a].setAttribute('style', `height: ${right[j]}%; width: ${barWidth}%;`);
                    j++;
                }
                changeColor(a, Colors.BLUE);
                a++;
            }
        }
    });
}
function heapSort() {
    return __awaiter(this, void 0, void 0, function* () {
        const parent = (i) => Math.floor((i - 1) / 2);
        const left = (i) => i * 2 + 1;
        const right = (i) => i * 2 + 2;
        let index = numberOfBars - 1;
        const downHeap = (j) => __awaiter(this, void 0, void 0, function* () {
            yield sleep(70);
            if (left(j) < index) {
                const leftChild = left(j);
                let bigger = leftChild;
                if (right(j) < index) {
                    const rightChild = right(j);
                    if (getElementHeight(rightChild) > getElementHeight(leftChild))
                        bigger = rightChild;
                }
                if (getElementHeight(bigger) > getElementHeight(j)) {
                    changeElements(bigger, j);
                    downHeap(bigger);
                }
            }
        });
        // bottom-up constructor
        const start = parent(numberOfBars);
        for (let i = start; i >= 0; i--) {
            yield downHeap(i);
        }
        // removing from heap and adding to the last
        for (let i = numberOfBars - 1; i >= 0; i--) {
            yield swapAndSleep(i, 0);
            yield downHeap(0);
            index--;
            changeColor(i, Colors.GREEN);
        }
    });
}
function selectionSort() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < numberOfBars; i++) {
            let smallest = i;
            changeColor(i, Colors.BLUE);
            for (let j = i + 1; j < numberOfBars; j++) {
                changeColor(j, Colors.YELLOW);
                yield sleep(10);
                changeColorToDefault(j);
                if (getElementHeight(j) < getElementHeight(smallest)) {
                    smallest = j;
                }
            }
            changeColor(smallest, Colors.BLUE);
            yield sleep(50);
            changeColorToDefault(smallest);
            changeColorToDefault(i);
            changeElements(smallest, i);
            changeColor(i, Colors.GREEN);
        }
    });
}
function insertionSort() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < numberOfBars; i++) {
            let cursor = i;
            while (cursor > 0 && getElementHeight(cursor) < getElementHeight(cursor - 1)) {
                changeColorToDefault(cursor);
                changeColor(cursor, Colors.YELLOW);
                yield sleep(30);
                changeColor(cursor, Colors.GREEN);
                changeElements(cursor, cursor - 1);
                cursor--;
            }
            changeColor(i, Colors.GREEN);
        }
    });
}
/********************************************************
 *                  Utility Functions
 *********************************************************/
function swapAndSleep(i, j) {
    return __awaiter(this, void 0, void 0, function* () {
        changeColor(i, Colors.BLUE);
        changeColor(j, Colors.BLUE);
        yield sleep(80);
        changeElements(i, j);
        changeColorToDefault(j);
        changeColorToDefault(i);
    });
}
function sliceOfFrame(start, stop) {
    const array = [];
    for (let i = start; i < stop; i++) {
        array.push(getElementHeight(i));
    }
    return array;
}
function sleep(msec) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, msec));
    });
}
function changeElements(i, j) {
    const heighti = getElementHeight(i);
    const heightj = getElementHeight(j);
    const bars = document.querySelectorAll('.bar');
    bars[i].setAttribute('style', `height: ${heightj}%; width: ${barWidth}%;`);
    bars[j].setAttribute('style', `height: ${heighti}%; width: ${barWidth}%;`);
}
function getElementHeight(index) {
    const bars = document.querySelectorAll('.bar');
    const height = bars[index].getAttribute('style')
        .split(' ')[1].replace('%', '').replace(';', '');
    return parseInt(height);
}
function changeColorToDefault(index) {
    const element = document.querySelectorAll('.bar')[index];
    element.className = 'bar';
}
function changeColor(index, color) {
    const element = document.querySelectorAll('.bar')[index];
    switch (color) {
        case Colors.YELLOW:
            element.classList.add('yellow');
            break;
        case Colors.GREEN:
            element.classList.add('green');
            break;
        case Colors.BLUE:
            element.classList.add('blue');
            break;
    }
}
function createArray(len) {
    const arr = [];
    for (let i = 0; i < len; i++) {
        const num = Math.floor(Math.random() * 90) + 8; // random number between 8, 98
        arr.push(num);
    }
    return arr;
}
function createElement(value, widthPercent = (barWidth)) {
    const elem = document.createElement('div');
    elem.classList.add('bar');
    elem.style.height = value + '%';
    elem.style.width = widthPercent + '%';
    return elem;
}
function populateFrame() {
    const array = createArray(numberOfBars);
    const elements = array.map(n => createElement(n));
    elements.forEach(e => frame === null || frame === void 0 ? void 0 : frame.appendChild(e));
}
function resetFrame() {
    frame.innerHTML = '';
    populateFrame();
}
