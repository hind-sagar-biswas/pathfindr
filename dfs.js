const graphNode = document.getElementById("grid");
const grid = [7, 7];

let time = -100;
let dfsGraph = new Array();

//graph
function dfsGraphGen() {
	let rowCount = grid[0];
	let colCount = grid[1];
	let nodeID = 0;
	const prevNode = 0;
	let generatedGraph = [];
	for (let row_i = 0; row_i < rowCount; row_i++) {
		let generatedRow = [];
		for (let col_i = 0; col_i < colCount; col_i++) {
			nodeID++;
			generatedRow.push([nodeID, false, prevNode]);
		}
		generatedGraph.push(generatedRow);
	}
	return generatedGraph;
}

// get adjacent function
function getAdj(currentNode) {
	let tempAdjPoints = [
		[currentNode[0] - 1, currentNode[1]],
		[currentNode[0], currentNode[1] - 1],
		[currentNode[0], currentNode[1] + 1],
		[currentNode[0] + 1, currentNode[1]],
	];
	tempAdjPoints = shuffle(tempAdjPoints);
	return filterAdjs(tempAdjPoints);
}
function filterAdjs(adjsToFilter) {
	let filteredAdjs = [];
	adjsToFilter.forEach((adj) => {
		if (
			adj[0] >= 0 &&
			adj[0] <= grid[0] - 1 &&
			adj[1] >= 0 &&
			adj[1] <= grid[1] - 1 &&
			!dfsGraph[adj[0]][adj[1]][1]
		) {
			filteredAdjs.push(adj);
		}
	});
	return filteredAdjs;
}



function DFS(node = [0, 0], prevNode = [0, 0]) {
	dfsGraph[node[0]][node[1]][1] = true;
	if (!dfsGraph[node[0]][node[1]][2]) dfsGraph[node[0]][node[1]][2] = prevNode;

	time += 100;
	setTimeout(() => {
	document.getElementById(`tracks`).textContent += `> ${
		dfsGraph[prevNode[0]][prevNode[1]][0]
	} `;
	document.getElementById(`cell-${dfsGraph[node[0]][node[1]][0]}`).style.color =
		"white";
	}, time);

	const nextNodes = getAdj(node);
	nextNodes.forEach(nextNode => {
		return DFS(nextNode, node);
	});
}




// Visualizers
function drawGraph() {
	while (graphNode.firstChild) {
		graphNode.removeChild(graphNode.lastChild);
	}

	dfsGraph.forEach((row, rowIndex) => {
		const rowElement = document.createElement("div");
		rowElement.className = "row";
		rowElement.id = `row-${rowIndex}`;
		graphNode.appendChild(rowElement);

		row.forEach((cell, cellIndex) => {
			let color = "#567d46";
			let value = cell[0];

			const cellElement = document.createElement("div");
			cellElement.className = "cell";
			cellElement.id = `cell-${cell[0]}`;
			cellElement.style.backgroundColor = color;
			cellElement.textContent = value;
			document.getElementById(`row-${rowIndex}`).appendChild(cellElement);
		});
	});
}

function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}


function runOnce() {
    dfsGraph = dfsGraphGen();
    drawGraph();
}


runOnce();
DFS();