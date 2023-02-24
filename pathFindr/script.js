/* GRAPH structure ****************************************************
graph => Object(
	key => int cellId
	value => Object(
		"blocked": bool false
		"destination": bool false [if true -> 'blocked' can't be true]
		"adjacents": Array(
			int cellId(s)
		)
	)
)
***********************************************************************/
// CONSTANTS
const graphNode = document.getElementById("graph");
const screenWidth = screen.width;

const graph = new Object();
const grid = [0, 0];


// VARIABLES
let start = 0; // Initial position
let target = 0; // Target position
let found = false; // whether the destination is found or not
let selector = "blocks";

let routes = [['0']];



// GENERATORS
function graphGen() {
	const nodeCount = grid[0] * grid[1];

	graph.length = 0;
	for (let nodeID = 0; nodeID < nodeCount; nodeID++) {
		const nodeObj = new Object();
		nodeObj.blocked = false;
		nodeObj.destination = (nodeID == target) ? true : false;
		nodeObj.adjacents = getAdj(nodeID);
		graph[`${nodeID}`] = nodeObj;
	}
}
function nodeToRow(node) {
	return Math.floor(parseInt(node) / grid[1]);
}
function nodeToCol(node) {
	return node - (nodeToRow(node) * grid[1]);
}
function row_colToNode(row, col) {
	return row * grid[1] + col;
}


// TOGGLES
function toggleBlockage(node) {
	if (node == start || node == target) return;
	switch (selector) {
		case "start":
			document.getElementById(`cell-${start}`).className = "cell ";
			document.getElementById(`cell-${node}`).className = "cell start ";
			start = node;
			routes = [[start]];
			graph[node].blocked = false;
			break;
			
		case "end":
			document.getElementById(`cell-${target}`).className = "cell ";
			document.getElementById(`cell-${node}`).className = "cell destination ";
			graph[target].destination = false;
			graph[target].blocked = false;
			target = node;
			graph[target].destination = true;
			graph[target].blocked = false;
			break;

		default:
			graph[node].blocked = !graph[node].blocked;
			document.getElementById(`cell-${node}`).classList.toggle("blocked");
			break;
	}
}
function switchSelector() {
	selector = document.forms["selector"]["toggler"].value;
}


// get possible adjacent nodeID(s)
function getAdj(node) {
	const row = nodeToRow(node);
	const col = nodeToCol(node);
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
			adj[0] <= grid[0] - 1 &&
			adj[1] >= 0 &&
			adj[1] <= grid[1] - 1
		) {
			tempFilteredAdjs.push(adj);
		}
	});
	tempFilteredAdjs.forEach((tempFilteredAdj) => {
		const adjVal = row_colToNode(tempFilteredAdj[0], tempFilteredAdj[1]);
		filteredAdjs.push(`${adjVal}`);
	});
	return filteredAdjs;
}
function checkAdjAvailable(node) {
	const adjacents = graph[node].adjacents;
	for (let adj = 0; adj < adjacents.length; adj++) {
		const adjId = adjacents[adj];
		if (!graph[adjId].blocked) return true;
	}
	return false;
}



// Route creation
function createNewRoute(currentRoute) {
	const formedRoutes = [];
	const currentRouteId = parseInt(currentRoute.at(-1));
	let currentRouteAdjs = graph[currentRouteId].adjacents;
	currentRouteAdjs.forEach((currentRouteAdj) => {
		if (!graph[currentRouteAdj].blocked) {
			const newFormedRoute = new Array();
			currentRoute.forEach((node) => {
				newFormedRoute.push(node);
			});
			newFormedRoute.push(currentRouteAdj);
			formedRoutes.push(newFormedRoute);
		}
	});
	return formedRoutes;
}
function filterRoutes(routesToFilter) {
	let filteredRoutes = new Array;
	let sameEndSets = new Object;
	routesToFilter = shuffle(routesToFilter);
	routesToFilter.forEach((routeToFilter) => {
		const routeEndPoint = routeToFilter.at(-1);
		if (!Object.hasOwnProperty.call(sameEndSets, routeEndPoint) || sameEndSets[routeEndPoint].length > routeToFilter.length ) {
			sameEndSets[routeEndPoint] = routeToFilter;
		}
	});
	for (const endPointKey in sameEndSets) {
		if (Object.hasOwnProperty.call(sameEndSets, endPointKey)) {
			const filteredRoute = sameEndSets[endPointKey];
			filteredRoutes.push(filteredRoute);
		}
	}
	return filteredRoutes;
}



// MAIN FUNCTIONS
function findr(oldRoutes) {
	let routeFound = false;
	let newRoutes = [];
	oldRoutes.every((route) => {
		const newRoute = createNewRoute(route);
		newRoute.every((nRoute) => {
			const routeEndpoint = nRoute.at(-1);

			if (graph[routeEndpoint].destination) {
				routeFound = true;
				newRoutes = [nRoute];
				return false;
			}

			newRoutes.push(nRoute);
			return true;
		});
		if (routeFound) return false;
		else return true;
	});
	newRoutes = filterRoutes(newRoutes);
	if (newRoutes.length == 1 && !checkAdjAvailable(newRoutes[0].at(-1))) return [true, newRoutes];
	return [routeFound, newRoutes];
}



// VISUALIZERS
function drawGraph() {
	while (graphNode.firstChild) {
		graphNode.removeChild(graphNode.lastChild);
	}
	for (let rowCount = 0; rowCount < grid[0]; rowCount++) {
		const rowElement = document.createElement("div");
		rowElement.className = "row";
		rowElement.id = `row-${rowCount}`;
		graphNode.appendChild(rowElement);
	}
	for (const node in graph) {
		if (Object.hasOwnProperty.call(graph, node)) {
			const nodeObj = graph[node];
			const rowId = `row-${nodeToRow(node)}`;
			if (node != "length") {
				const nodeElement = document.createElement("div");
				nodeElement.className = "cell ";
				if (parseInt(node) == start) nodeElement.className += "start ";
				else if (nodeObj.destination) nodeElement.className += "destination ";
				else if (nodeObj.blocked) nodeElement.className += "blocked ";
				nodeElement.id = `cell-${node}`;
				document.getElementById(rowId).appendChild(nodeElement);
				document.getElementById(`cell-${node}`).addEventListener("click", () => {
					toggleBlockage(node);
				});
			}
		}
	}
	if (screenWidth <= 500) {
		graphNode.style.width = `${screenWidth - 40}px`;
		graphNode.style.height = `${screenWidth - 40}px`;

		const cellSide = (screenWidth - 40) / grid[0];
		const cellWidth = (screenWidth - 40) / grid[1];
		console.log(cellSide);
		const cellList = document.getElementsByClassName("cell");

		for (let cellCount = 0; cellCount < cellList.length; cellCount++) {
			const cellElement = cellList[cellCount];
			cellElement.style.height = `${cellSide}px`;
			cellElement.style.width = `${cellWidth}px`;
		}
	}
}
function routeColor(routeList, mainRoute = false) {
	routeList.forEach((route) => {
		let baseTime = -100;
		let timeInterval = 100;
		let color = "lightgreen";
		let borderColor = "green";
		if (mainRoute) {
			color = "green";
			borderColor = "darkgreen";
			baseTime = route.length * 100;
		}
		route.forEach((node) => {
			let time = baseTime + timeInterval;
			setTimeout(() => {
				document.getElementById(`cell-${node}`).style.backgroundColor = color;
				document.getElementById(`cell-${node}`).style.borderColor = borderColor;
			}, time);
			baseTime = time;
		});
	});
	if (found) {
		if (graph[routeList[0].at(-1)].destination) document.getElementById("route").textContent = JSON.stringify(routeList[0]);
		else document.getElementById("route").textContent = "no valid routes found!";
	}
}


// EXECUTORS
function generate() {
	graphNode.style.pointerEvents = "all";

	// Resets
	grid[0] = 0;
	grid[1] = 0;
	start = 0;
	target = 0;
	found = false;

	// Get values
	grid[0] = parseInt(document.getElementById("row").value);
	grid[1] = parseInt(document.getElementById("col").value);

	target = (grid[0] * grid[1]) - 2 - grid[0];
	start = row_colToNode(1, 1);

	// Generate graph
	graphGen();
	drawGraph();

	// Enable buttons
	document.getElementById("runner").disabled = false;
	document.getElementById("runner-once").disabled = false;

	// Set value of routes
	routes = [[start]];
	return false;
}
function runOnce() {
	grid[0] = 7;
	grid[1] = 6;
	graphGen();
	drawGraph();
}
function run() { 
	graphNode.style.pointerEvents = "none";

	var startTime = performance.now();
	while (!found) {
		[found, routes] = findr(routes);
		routeColor(routes);
	}
	var endTime = performance.now();

	routeColor(routes, true);
	document.getElementById("time").textContent = `took ${((endTime - startTime) / 1000).toFixed(3)} seconds to find!`;
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


// Executions
window.addEventListener("load", () => {
	// For mobile screens
	if (screen.width <= 500) {
		const mainCont = document.getElementById("container");
		const routeCont = document.getElementById("route-cont");
		mainCont.style.height = `${
			mainCont.offsetHeight + routeCont.offsetHeight * 3 + screenWidth + 100
		}px`;
		mainCont.style.padding = "5px";
		console.log(mainCont.offsetHeight);
	}
});
