# pathfindr v1.3

A visualizer of path finder algorithm. Generate a grid, set blockades, choose start and end points and the algo will find you the shortest route to your Destinatin....

## IMPORTANT NOTES

- Make sure to keep at least one path open [else RIP your RAM!]
- The bigger the grid you make, the more time it will take [Highest recommendation: 30x30]
- There might be some BUGS

If any bugs found, create an issue or report at <ryoutaroshinigami@gmail.com>

**PATH FINDR:** implementation of _BFS algorithm_

**MAZE GENERATOR:** implementation of _DFS algorithm_

## NEXT TARGETS

- Create maze runner game [**DIR:** mazeRunr]
  - Generate a maze [DONE]
  - Find the longest open route to set up start and target points.
    - Modify _BFS algorithm_ to run through all open nodes to find the longest route.
  - Put a player avatar on start point and make it able to go through open nodes.
- Develop **A\* algorithm**
