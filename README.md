# Quake Source Files Include Dependency Graph
This project is a tool for generating a graph visualization of C/C++ include dependencies. The graph is rendered in an HTML page using d3.js.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
- Python 3.x
- d3.js
- A web browser
### Installing
1. Clone the repository:

        git clone https://github.com/<username>/include-dependency-graph.git

1. Run the script to create the dataset by providing the root directories of the C/C++ files as command line arguments.

        python create_dataset.py "D://repos//Quake//common" "D://repos//Quake//QuakeGL" "D://repos//Quake//QuakeHW"

1. Open index.html in a web browser.
## How it works
The script `create_dataset.py` recursively searches the provided directories for .c and .h files, and extracts the include dependencies of each file using regular expressions. The extracted dependencies are stored in a dictionary where the keys are the names of the files and the values are lists of the file's dependencies.

The script then converts the dictionary into a more structured format that is easier to work with for the visualization. It creates a node for each file and link for each dependency, and calculates the weight of each node based on the difference between the number of incoming and outgoing links.

Finally, the calculated dataset is written to a JavaScript file, "dataset.js" with a variable named "dataset" which contains the dataset.

The HTML file, `index.html` loads the dataset and uses d3.js to create the visualization. The script uses a force simulation to position and shape the graph, and allows the nodes to be draggable.
## Built With
- Python (https://www.python.org/) - The programming language used
- d3.js (https://d3js.org/) - The JavaScript library used for creating the visualization
## Authors
- mnsir - Initial work
## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
## Acknowledgments
- Hat tip to anyone whose code was used
- Inspiration
- etc