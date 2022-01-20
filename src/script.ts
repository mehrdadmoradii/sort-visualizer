const frame = document.querySelector('.frame');

const generateFrameBtn = document.querySelector('#generate-frame-btn');
const startBtn =  document.querySelector('#algorithm-selector-btn');

enum Colors {
    RED, GREEN, YELLOW, BLUE
}

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

generateFrameBtn.addEventListener('click', () => {
    if (sortStarted) 
        location.reload();
    resetFrame();
})

startBtn.addEventListener('click', async () => {
    if (sortStarted) 
        location.reload();
    (<HTMLInputElement>document.querySelector('.algorithm-selector-container')).style.visibility = 'hidden';
    sortStarted = true;
    const selector = (<HTMLInputElement>document.querySelector('#algorithm-selector'));
    switch (selector.value) {
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'merge':
            await mergeSort();
            break;
        case 'quick':
            await quickSort();
            break;
        case 'heap':
            await heapSort();
            break;
    }
})


/********************************************************
 *                   Sorting Algorithms
 *********************************************************/


async function partition(low: number, high: number) {
    const pivot = getElementHeight(high);
    let i = (low - 1);

    changeColor(high, Colors.YELLOW);

    for (let j=low; j<=high-1; j++) {
        if (getElementHeight(j) < pivot) {
            i++;
            await swapAndSleep(i, j);
        }
    }

    changeColorToDefault(high);
    await swapAndSleep(i+1, high);
    return (i+1);
}

async function quickSort (low: number=0, high: number=numberOfBars-1) {
    if (low<high) {
        const pi = await partition(low, high);
        await quickSort(low, pi-1);
        await quickSort(pi+1, high);
    }
    if (low===0 && high===numberOfBars-1) {
        for (let i=0; i<numberOfBars; i++) {
            await sleep(5);
            changeColor(i, Colors.GREEN);
        }
    }
}

async function mergeSort() {
    await mergeSorthelper()
    for (let i=0; i<numberOfBars; i++) {
        changeColorToDefault(i);
        await sleep(5);
        changeColor(i, Colors.GREEN);
    }
}

async function mergeSorthelper(a:number=0, b:number=null) {
    if (b === null) b = numberOfBars;
    if (b-a > 1) {
        const center = Math.floor((b+a+1)/2);
        await mergeSorthelper(a, center);
        await mergeSorthelper(center, b);

        const left = sliceOfFrame(a, center);
        const right = sliceOfFrame(center, b);
        let i = 0; 
        let j = 0;

        while(b>a) {
            const bars = document.querySelectorAll('.bar');
            await sleep(20);
            if ((j>=right.length) || (i<left.length && left[i] < right[j])) {
                bars[a].setAttribute('style', `height: ${left[i]}%; width: ${barWidth}%;`); 
                i++;
            } else {
                bars[a].setAttribute('style', `height: ${right[j]}%; width: ${barWidth}%;`); 
                j++;
            }
            changeColor(a, Colors.BLUE);
            a++;
        }
    }
}


async function heapSort() {
    const parent = (i: number) => Math.floor((i-1) / 2);
    const left = (i:number) => i*2 + 1;
    const right = (i:number) => i*2 + 2;

    let index = numberOfBars-1;

    const downHeap = async (j: number) => {
        await sleep(70);
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
    }


    // bottom-up constructor
    const start = parent(numberOfBars);
    for (let i=start; i>=0; i--) {
        await downHeap(i);
    }

    // removing from heap and adding to the last
    for (let i=numberOfBars-1; i>=0; i--) {
        await swapAndSleep(i, 0);
        await downHeap(0);
        index--;
        changeColor(i, Colors.GREEN);
    }

}


async function selectionSort() {
    for (let i=0; i<numberOfBars; i++) {
        let smallest = i;
        changeColor(i, Colors.BLUE);
        for (let j=i+1; j<numberOfBars; j++) {
            changeColor(j, Colors.YELLOW);
            await sleep(10);
            changeColorToDefault(j);
            if (getElementHeight(j) < getElementHeight(smallest)) {
                smallest = j;
            }
        }
        changeColor(smallest, Colors.BLUE);
        await sleep(50);
        changeColorToDefault(smallest);
        changeColorToDefault(i);
        changeElements(smallest, i);
        changeColor(i, Colors.GREEN);
    }
}


async function insertionSort() {
    for (let i=0; i<numberOfBars; i++) {
        let cursor = i;
        while (cursor > 0 && getElementHeight(cursor) < getElementHeight(cursor-1)) {
            changeColorToDefault(cursor);
            changeColor(cursor, Colors.YELLOW);
            await sleep(30);
            changeColor(cursor, Colors.GREEN);
            changeElements(cursor, cursor-1);
            cursor--;
        }
        changeColor(i, Colors.GREEN);
    }
}


/********************************************************
 *                  Utility Functions
 *********************************************************/


async function swapAndSleep(i: number, j: number) {
    changeColor(i, Colors.BLUE);
    changeColor(j, Colors.BLUE);
    await sleep(80);
    changeElements(i, j);
    changeColorToDefault(j);
    changeColorToDefault(i); 
}

function sliceOfFrame (start: number, stop: number) {
    const array = [];
    for (let i=start; i<stop; i++) {
        array.push(getElementHeight(i));
    }
    return array;
}

async function sleep(msec: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, msec));
}

function changeElements(i:number, j:number) {
    const heighti = getElementHeight(i);
    const heightj = getElementHeight(j);
    const bars = document.querySelectorAll('.bar');
    bars[i].setAttribute('style', `height: ${heightj}%; width: ${barWidth}%;`);
    bars[j].setAttribute('style', `height: ${heighti}%; width: ${barWidth}%;`);
}

function getElementHeight(index: number) {
    const bars = document.querySelectorAll('.bar');
    const height = bars[index].getAttribute('style')
                    .split(' ')[1].replace('%', '').replace(';', '');
    return parseInt(height);
}

function changeColorToDefault(index: number) {
    const element = document.querySelectorAll('.bar')[index];
    element.className = 'bar';
}

function changeColor(index: number, color: Colors) {
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

function createArray(len: number): Array<number> {
    const arr: Array<number> = [];
    for (let i=0; i<len; i++) {
        const num = Math.floor(Math.random()*90) + 8; // random number between 8, 98
        arr.push(num);
    }
    return arr;
}

function createElement(value: number, widthPercent: number = (barWidth)) {
    const elem = document.createElement('div');
    elem.classList.add('bar');
    elem.style.height = value + '%';
    elem.style.width = widthPercent + '%';
    return elem;
}

function populateFrame() {
    const array = createArray(numberOfBars);
    const elements = array.map(n => createElement(n));
    elements.forEach(e => frame?.appendChild(e));
}

function resetFrame() {
    frame.innerHTML = '';
    populateFrame();
}