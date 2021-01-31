
import * as jac from 'jac';
import { SetSortTree, ArraySortTree, SortTreeNode } from 'sort-tree';
import { round } from 'math';

// just a playground for active development right now

//testJACStress();
//testArrayTree();
//testSetTree();

testCloud();

function printNode(node: SortTreeNode<number>, depth = 0) {
    const indent = Array(depth).fill(' ').join('');
    
    if (node.left.keys.length) {
        printNode(node.left, depth + 1);
    }

    console.log(`${indent}${node.keys.join(' ')}`);

    if (node.right.keys.length) {
        printNode(node.right, depth + 1);
    }
}

function add(sum: Record<string, number>, add: Record<string, number>) {
    const vol = add['volume'];

    for (let [k, v] of Object.entries(add)) {
        if (k !== 'volume') {
            v *= vol;
        }

        if (sum[k]) {
            sum[k] += v;
        } else {
            sum[k] = v;
        }
    }
    
    return sum;
}

function roundSum(sum: Record<string, number>) {
    for (let [k, v] of Object.entries(sum)) {
        sum[k] = round(v);
    }

    return sum;
}

function testSetTree() {
    const tree = new SetSortTree((a: number, b: number) => {
        return b - a;
    });

    tree.update(0);
    tree.update(1);
    tree.update(2);
    tree.update(3);
    tree.update(4);
    tree.update(5);
    tree.update(-1);
    tree.update(-2);
    tree.update(6);
    tree.update(7);

    console.log('min', tree.firstKey(), 'max', tree.lastKey());

    printNode(tree.root);
}

function testArrayTree() {
    const arr = [0, 0, 0, 1, 1, 1, 2, 2, 2];
    const tree = new ArraySortTree(arr, (a: number, b: number) => {
        return b - a;
    });

    tree.update(3);
    tree.update(4);
    tree.update(5);
    tree.update(0);
    tree.update(1);
    tree.update(2);
    tree.update(6);
    tree.update(7);
    tree.update(8);

    console.log('min', tree.firstKey(), 'max', tree.lastKey());

    printNode(tree.root);

    for (const k of tree.keysReversedFromValue(0.1, false)){
        console.log(k);
    }
}

function testCloud() {
    const cloud = new jac.JAC({maxPoints: 300}, 'volume', 'x', 'y');

    cloud.add({
        volume: 1,
        x: 1,
        y: 1
    });

    cloud.add({
        volume: 1,
        x: 2,
        y: 2,
    });
    
    cloud.add({
        volume: 1,
        x: 3,
        y: 3
    });

    console.log(cloud.cloud.ranges([,[-10, 1.8]]));
}

function testJACStress() {
    const cloud = new jac.JAC({maxPoints: 300}, 'volume', 'x', 'y');

    const sum: Record<string, number> = {};

    for (let i = 0; i < 10000; i++) {
        console.log(i);
        const obj = {
            volume: 1,
            x: Math.random(),
            y: Math.random(),
        };

        cloud.add(obj);
        add(sum, obj);
    }

    for (const [i, d] of cloud.cloud.dimensions.entries()) {
        console.log(`---- Dimension ${i} ----`);
        console.log(`Depth: ${d.tree.depth()}`)
        //console.log(`Data:`);
        //printNode(d.tree.root);
    }

    const sum2: Record<string, number> = {};

    for (const p of cloud.getData()) {
        add(sum2, p);
    }

    console.log(roundSum(sum));
    console.log(roundSum(sum2));
}
