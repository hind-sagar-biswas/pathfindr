const graphNode = document.getElementById("graph");
const screenWidth = screen.width;

let graph = new Array();
let grid = [0, 0];
let startVal = 0;
let targetVal = 1;
let start = [0, 0];
let found = false;

let selector = "blocks";

let routes = new Array();
routes.push([]);
routes[0].push(start);

//graph
function graphGen() {
	let rowCount = grid[0];
	let colCount = grid[1];
	let cellCount = 0;
	let generatedGraph = [];
	for (let row_i = 0; row_i < rowCount; row_i++) {
		let generatedRow = [];
		for (let col_i = 0; col_i < colCount; col_i++) {
			cellCount++;
			generatedRow.push([cellCount, false]);
		}
		generatedGraph.push(generatedRow);
	}
	return generatedGraph;
}
function toggleBlockage(rowIndex, colIndex, id) {
	if (id == startVal || id == targetVal) return;
	switch (selector) {
		case "start":
			startVal = id;
			start[0] = rowIndex;
			start[1] = colIndex;
			graph[rowIndex][colIndex][1] = false;
			break;

		case "end":
			targetVal = id;
			graph[rowIndex][colIndex][1] = false;
			break;

		default:
			graph[rowIndex][colIndex][1] = !graph[rowIndex][colIndex][1];
			break;
	}
	drawGraph();
}
function switchSelector() {
	selector = document.forms["selector"]["toggler"].value;
}

// get adjacent function
function getAdj(adjRoute) {
	const adjRouteEndPoint = adjRoute.at(-1);
	let tempAdjPoints = [
		[adjRouteEndPoint[0] - 1, adjRouteEndPoint[1]],
		[adjRouteEndPoint[0], adjRouteEndPoint[1] - 1],
		[adjRouteEndPoint[0], adjRouteEndPoint[1] + 1],
		[adjRouteEndPoint[0] + 1, adjRouteEndPoint[1]],
	];
	tempAdjPoints = shuffle(tempAdjPoints);
	return filterAdjs(adjRoute, tempAdjPoints);
}
function filterAdjs(routeOfAdjs, adjsToFilter) {
	const solidRoute = getSolidRoute(routeOfAdjs);
	let tempFilteredAdjs = [];
	let filteredAdjs = [];
	adjsToFilter.forEach((adj) => {
		if (
			adj[0] >= 0 &&
			adj[0] <= grid[0] - 1 &&
			adj[1] >= 0 &&
			adj[1] <= grid[1] - 1 &&
			!graph[adj[0]][adj[1]][1]
		) {
			tempFilteredAdjs.push(adj);
		}
	});
	tempFilteredAdjs.forEach((tempFilteredAdj) => {
		const adjVal = graph[tempFilteredAdj[0]][tempFilteredAdj[1]][0];
		if (!solidRoute.includes(adjVal)) {
			filteredAdjs.push(tempFilteredAdj);
		}
	});
	return filteredAdjs;
}
const getSolidRoute = (liquidRoute) => {
	let solidRouteResult = [];
	liquidRoute.forEach((liquidRouteCell) => {
		solidRouteResult.push(graph[liquidRouteCell[0]][liquidRouteCell[1]][0]);
	});
	return solidRouteResult;
};


// Route creation
function createNewRoute(currentRoute) {
	const formedRoutes = [];
	const currentRouteAdjs = getAdj(currentRoute);
	currentRouteAdjs.forEach((currentRouteAdj) => {
		const newFormedRoute = new Array();
		currentRoute.forEach((elem) => {
			newFormedRoute.push(elem);
		});
		newFormedRoute.push(currentRouteAdj);
		formedRoutes.push(newFormedRoute);
	});
	return formedRoutes;
}
function filterRoutes(routesToFilter) {
	let filteredRoutes = [];
	let sameEndSets = {};
	routesToFilter.forEach((routeToFilter) => {
		const routeEndPointArr = routeToFilter.at(-1);
		const routeEndpointKey = `${routeEndPointArr[0]}-${routeEndPointArr[1]}`;
		if (
			!Object.hasOwnProperty.call(sameEndSets, routeEndpointKey) ||
			sameEndSets[routeEndpointKey].length > routeToFilter.length
		) {
			sameEndSets[routeEndpointKey] = routeToFilter;
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


// Main function
function main(oldRoutes) {
	let routeFound = false;
	let newRoutes = [];
	oldRoutes.every((route) => {
		const newRoute = createNewRoute(route);
		newRoute.every((nRoute) => {
			const routeEndpoint = getSolidRoute(nRoute).at(-1);

			if (routeEndpoint == targetVal) {
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
	if (newRoutes.length == 1 && getAdj(newRoutes[0]).length == 0)
		return [true, newRoutes];
	return [routeFound, newRoutes];
}

// Visualizers
function drawGraph() {
	while (graphNode.firstChild) {
		graphNode.removeChild(graphNode.lastChild);
	}

	graph.forEach((row, rowIndex) => {
		const rowElement = document.createElement("div");
		rowElement.className = "row";
		rowElement.id = `row-${rowIndex}`;
		graphNode.appendChild(rowElement);

		row.forEach((cell, cellIndex) => {
			let color = "#567d46";
			let value = "";

			if (cell[1]) color = "#333333";
			if (startVal == cell[0]) {
				color = "green";
				value = `<i class="fas fa-street-view" style="color: white"></i>`;
			} else if (targetVal == cell[0]) {
				color = "red";
				value = `<i class="fas fa-flag" style="color: white"></i>`;
			}

			const cellElement = document.createElement("div");
			cellElement.className = "cell";
			cellElement.id = `cell-${cell[0]}`;
			cellElement.style.backgroundColor = color;
			cellElement.innerHTML = value;
			document.getElementById(`row-${rowIndex}`).appendChild(cellElement);
			document
				.getElementById(`cell-${cell[0]}`)
				.addEventListener("click", () => {
					toggleBlockage(rowIndex, cellIndex, cell[0]);
				});
		});
	});

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
	routeList.forEach((rt) => {
		let baseTime = -100;
		let timeInterval = 100;
		let color = "lightgreen";
		let borderColor = "green";
		if (mainRoute) {
			color = "green";
			borderColor = "darkgreen";
			baseTime = rt.length * 100;
		}
		rt.forEach((r) => {
			let time = baseTime + timeInterval;
			const id = graph[r[0]][r[1]][0];
			setTimeout(() => {
				document.getElementById(`cell-${id}`).style.backgroundColor = color;
				document.getElementById(`cell-${id}`).style.borderColor = borderColor;
			}, time);
			baseTime = time;
		});
	});
	if (found) {
		let solid = getSolidRoute(routeList[0]);
		if (solid.at(-1) == targetVal)
			document.getElementById("route").textContent = JSON.stringify(solid);
		else
			document.getElementById("route").textContent = "no valid routes found!";
	}
}

// Executors
function generate() {
	graphNode.style.pointerEvents = "all";

	// Reset
	graph = [];
	grid = [0, 0];
	startVal = 0;
	targetVal = 1;
	start = [0, 0];
	found = false;

	// Get values
	grid[0] = parseInt(document.getElementById("row").value);
	grid[1] = parseInt(document.getElementById("col").value);
	start[0] = parseInt(document.getElementById("row").value) - 1;
	start[1] = parseInt(document.getElementById("col").value) - 1;
	graph = graphGen();
	startVal = graph[start[0]][start[1]][0];

	// Draw graph
	drawGraph();

	// Enable buttons
	document.getElementById("runner").disabled = false;
	document.getElementById("runner-once").disabled = false;

	// Set value of routes
	routes.length = 0;
	routes.push([]);
	routes[0].push(start);

	return false;
}
function runOnce() {
	if (found) return 0;
	[found, routes] = main(routes);
	routeColor(routes);
	document.getElementById("route").innerHTML = "";
	routes.forEach(
		(el) =>
			(document.getElementById("route").innerHTML += JSON.stringify(
				getSolidRoute(el)
			))
	);
}
function run() {
	graphNode.style.pointerEvents = "none";

	var startTime = performance.now();
	while (!found) {
		[found, routes] = main(routes);
		routeColor(routes);
	}
	var endTime = performance.now();

	drawGraph();
	routeColor(routes, true);
	document.getElementById("time").textContent = `took ${(
		(endTime - startTime) /
		1000
	).toFixed(3)} seconds to find!`;
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
