angular.module('cytoscapeSample').directive('cytoscape', function($rootScope) {
    // graph visualisation by - https://github.com/cytoscape/cytoscape.js
    return {
        restrict: 'E',
        template :'<div id="cy"></div>',
        replace: true,
        scope: {
            // data objects to be passed as an attributes - for nodes and edges
            cyData: '=',
            cyEdges: '=',
            // controller function to be triggered when clicking on a node
            cyClick:'&'
        },
        link: function(scope, element, attrs, fn) {
            // dictionary of colors by types. Just to show some design options
            scope.typeColors = {
                'ellipse':'#992222',
                'triangle':'#222299',
                'rectangle':'#661199',
                'roundrectangle':'#772244',
                'pentagon':'#990088',
                'hexagon':'#229988',
                'heptagon':'#118844',
                'octagon':'#335577',
                'star':'#113355'
            };

            // graph  build
            scope.doCy = function(){ // will be triggered on an event broadcast
                // initialize data object
                scope.elements = {};
                scope.elements.nodes = [];
                scope.elements.edges = [];

                // parse edges
                // you can build a complete object in the controller and pass it without rebuilding it in the directive.
                // doing it like that allows you to add options, design or what needed to the objects
                // doing it like that is also good if your data object/s has a different structure
                for (i=0; i<scope.cyEdges.length; i++)
                {
                    // get edge source
                    var eSource = scope.cyEdges[i].source;
                    // get edge target
                    var eTarget = scope.cyEdges[i].target;
                    // get edge id
                    var eId = scope.cyEdges[i].id;
                    // build the edge object
                    var edgeObj = {
                        data:{
                        id:eId,
                        source:eSource,
                        target:eTarget
                        }
                    };
                    // adding the edge object to the edges array
                    scope.elements.edges.push(edgeObj);
                }

                // parse data and create the Nodes array
                // object type - is the object's group
                for (i=0; i<scope.cyData.length; i++)
                {
                    // get id, name and type  from the object
                    var Oid = scope.cyData[i].id;
                    var Oname = scope.cyData[i].name;
                    var Otype = scope.cyData[i].type;
                    // get color from the object-color dictionary
                    var typeColor = scope.typeColors[Otype];
                    // build the object, add or change properties as you need - just have a name and id
                    var elementObj = {
                        group:Otype,'data':{
                            id:Oid,
                            name:Oname,
                            typeColor:typeColor,
                            typeShape:Otype,
                            type:Otype
                    }};
                    // add new object to the Nodes array
                    scope.elements.nodes.push(elementObj);
                }

                // graph  initialization
                // use object's properties as properties using: data(propertyName)
                // check Cytoscapes site for much more data, options, designs etc
                // http://cytoscape.github.io/cytoscape.js/
                // here are just some basic options
                $('#cy').cytoscape({
                    layout: {
                        name: 'circle',
                        fit: true, // whether to fit the viewport to the graph
                        ready: undefined, // callback on layoutready
                        stop: undefined, // callback on layoutstop
                        padding: 5 // the padding on fit
                    },
                    style: cytoscape.stylesheet()
                        .selector('node')
                        .css({
                            'shape': 'data(typeShape)',
                            'width': '120',
                            'height': '90',
                            'background-color': 'data(typeColor)',
                            'content': 'data(name)',
                            'text-valign': 'center',
                            'color': 'white',
                            'text-outline-width': 2,
                            'text-outline-color': 'data(typeColor)'
                        })
                        .selector('edge')
                        .css({
                            'width': '10',
                            'target-arrow-shape': 'triangle',
                            'source-arrow-shape': 'triangle'
                        })
                        .selector(':selected')
                        .css({
                            'background-color': 'black',
                            'line-color': 'black',
                            'target-arrow-color': 'black',
                            'source-arrow-color': 'black'
                        })
                        .selector('.faded')
                        .css({
                            'opacity': 0.65,
                            'text-opacity': 0.65
                        }),
                        ready: function(){
                        window.cy = this;

                        // giddy up...
                        cy.elements().unselectify();

                        // Event listeners
                        // with sample calling to the controller function as passed as an attribute
                        cy.on('tap', 'node', function(e){
                            var evtTarget = e.cyTarget;
                            var nodeId = evtTarget.id();
                            scope.cyClick({value:nodeId});
                        });

                        // load the objects array
                        // use cy.add() / cy.remove() with passed data to add or remove nodes and edges without rebuilding the graph
                        // sample use can be adding a passed variable which will be broadcast on change
                        cy.load(scope.elements);
                    }
                });

            }; // end doCy()

            // When the app object changed = redraw the graph
            // you can use it to pass data to be added or removed from the object without redrawing it
            // using cy.remove() / cy.add()
            $rootScope.$on('appChanged', function(){
                scope.doCy();
            });
        }
    };
});