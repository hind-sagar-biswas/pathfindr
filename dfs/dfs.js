/* GRAPH structure ****************************************************
graph => Object(
	key => int cellId
	value => Object(
		"visited": bool false
		"previous": string nodeId [stores the previos node : -1 -> origin node, null -> not visited]
		"complementary": string complementary node Id <- only when implemented
		"adjacents": Array(
			int cellId(s)
		)
	)
)
***********************************************************************/
// CONSTANTS
const graphNode = document.getElementById("graph");

const dfsGraph = new Object();
const dfsGrid = [0, 0];

// VARIABLES
let time = -100;

// GENERATORS
function graphGenDFS() {
	const nodeCount = dfsGrid[0] * dfsGrid[1];

	dfsGraph.length = 0;
	for (let nodeID = 0; nodeID < nodeCount; nodeID++) {
		const nodeObj = new Object();
		nodeObj.visited = false;
		nodeObj.previous = nodeID == 0 ? "-1" : null;
		nodeObj.complementary = null;
		nodeObj.adjacents = getAdj(nodeID);
		dfsGraph[`${nodeID}`] = nodeObj;
	}
}

// get possible adjacent nodeID(s)
function getAdj(node) {
	const row = Math.floor(node / dfsGrid[1]);
	const col = node - row * dfsGrid[1];
	let tempAdjPoints = [
		[row - 1, col],
		[row, col - 1],
		[row, col + 1],
		[row + 1, col],
	];
	return filterAdjs(tempAdjPoints);
}
function filterAdjs(adjsToFilter) {
	let tempFilteredAdjs = [];
	let filteredAdjs = [];
	adjsToFilter.forEach((adj) => {
		if (
			adj[0] >= 0 &&
			adj[0] <= dfsGrid[0] - 1 &&
			adj[1] >= 0 &&
			adj[1] <= dfsGrid[1] - 1
		) {
			tempFilteredAdjs.push(adj);
		}
	});
	tempFilteredAdjs.forEach((tempFilteredAdj) => {
		const adjVal = tempFilteredAdj[0] * dfsGrid[1] + tempFilteredAdj[1];
		filteredAdjs.push(`${adjVal}`);
	});
	return shuffle(filteredAdjs);
}
function checkAdjAvailableDFS(node) {
	const adjacents = dfsGraph[node].adjacents;
	for (let adj = 0; adj < adjacents.length; adj++) {
		if (!dfsGraph[adj].visited) return true;
	}
	return false;
}

// MAIN FUNCTIONS
function DFS(node = "0", prevNode = "-1") {
	if (!dfsGraph[node].visited) {
		dfsGraph[node].previous = prevNode;
		dfsGraph[node].visited = true;
	}

	time += 100;
	setTimeout(() => {
		document.getElementById(`tracks`).textContent += `> ${node} `;
		document.getElementById(`cell-${node}`).style.color = "white";
	}, time);

	// if (!checkAdjAvailableDFS(node)) return true;
	const adjNodes = dfsGraph[node].adjacents;
	adjNodes.forEach(adjNode => {
		if(adjNode != prevNode && !dfsGraph[adjNode].visited) return DFS(adjNode, node);
	});
	return;
}

// VISUALIZERS
function drawDFSGraph() {
	while (graphNode.firstChild) {
		graphNode.removeChild(graphNode.lastChild);
	}
	for (let rowCount = 0; rowCount < dfsGrid[0]; rowCount++) {
		const rowElement = document.createElement("div");
		rowElement.className = "row";
		rowElement.id = `row-${rowCount}`;
		graphNode.appendChild(rowElement);
	}
	for (const node in dfsGraph) {
		if (Object.hasOwnProperty.call(dfsGraph, node)) {
			const nodeObj = dfsGraph[node];
			const rowId = `row-${Math.floor(parseInt(node) / dfsGrid[1])}`;
			if (node != "length") {
				const nodeElement = document.createElement("div");
				nodeElement.className = "cell ";
				nodeElement.id = `cell-${node}`;
				nodeElement.textContent = node;
				document.getElementById(rowId).appendChild(nodeElement);
				document
					.getElementById(`cell-${node}`)
					.addEventListener("click", () => {
						toggleBlockage(node);
					});
			}
		}
	}
}
function drawDFS() {}

// EXECUTORS
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

function run() {
	dfsGrid[0] = 5;
	dfsGrid[1] = 5;
	graphGenDFS();
	drawDFSGraph();
	DFS();
}
