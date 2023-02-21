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
let found = false; // whether the destination is found or not
let selector = "blocks";

let routes = new Array();
routes.push([]);
routes[0].push(toString(start));



// GENERATORS
function graphGen() {
	const nodeCount = grid[0] * grid[1];

	graph.length = 0;
	for (let nodeID = 0; nodeID < nodeCount; nodeID++) {
		const nodeObj = new Object();
		nodeObj.blocked = false;
		nodeObj.destination = (nodeID == nodeCount - 1) ? true : false;
		nodeObj.adjacents = getAdj(nodeID);
		graph[`${nodeID}`] = nodeObj;
	}
}



// get possible adjacent nodeID(s)
function getAdj(node) {
	const row = Math.floor(node / grid[1]);
	const col = node - (row * grid[1]);
	let tempAdjPoints = [
		[row - 1, col],
		[row, col - 1],
		[row, col + 1],
		[row + 1, col],
	];
	tempAdjPoints = shuffle(tempAdjPoints);
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
		const adjVal = (tempFilteredAdj[0] * grid[1]) + tempFilteredAdj[1];
		filteredAdjs.push(toString(adjVal));
	});
	return filteredAdjs;
}
function checkAdjAvailable(node) {
	graph[node].adjacents.forEach(adj => { if (!graph[adj].blocked) return true; });
	return false;
}



// Route creation
function createNewRoute(currentRoute) {
	const formedRoutes = [];
	const currentRouteId = parseInt(currentRoute.at(-1));
	const currentRouteAdjs = graph[currentRouteId].adjacents;
	currentRouteAdjs.forEach((currentRouteAdj) => {
		if (!graph[currentRouteAdj].blocked) {
			const newFormedRoute = new Array();eEndPoint
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
	let filteredRoutes = [];
	let sameEndSets = {};
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
function findr(routes) {
	let routeFound = false;
	let newRoutes = [];
	routes.every((route) => {
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
	for (let rowCount = 0; rowCount < grid[0]; rowCount++) {
		const rowElement = document.createElement("div");
		rowElement.className = "row";
		rowElement.id = `row-${rowCount}`;
		graphNode.appendChild(rowElement);
	}
	for (const node in graph) {
		if (Object.hasOwnProperty.call(graph, node)) {
			const nodeObj = graph[node];
			const rowId = `row-${Math.floor(parseInt(node) / grid[1])}`;
			if (node != "length") {
				const nodeElement = document.createElement("div");
				nodeElement.className = "cell ";
				if (parseInt(node) == start) nodeElement.className += "start ";
				else if (nodeObj.destination) nodeElement.className += "destination ";
				else if (nodeObj.blocked) nodeElement.className += "blocked ";
				nodeElement.id = `cell-${node}`;
				document.getElementById(rowId).appendChild(nodeElement);
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
		if (routeList[0].at(-1) == targetVal) document.getElementById("route").textContent = JSON.stringify(solid);
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
	found = false;

	// Get values
	grid[0] = parseInt(document.getElementById("row").value);
	grid[1] = parseInt(document.getElementById("col").value);

	// Generate graph
	graphGen();
	drawGraph();

	// Enable buttons
	document.getElementById("runner").disabled = false;
	document.getElementById("runner-once").disabled = false;

	// Set value of routes
	routes.length = 0;
	routes.push([]);
	routes[0].push(toString(start));

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