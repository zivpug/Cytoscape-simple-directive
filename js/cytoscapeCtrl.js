angular.module('cytoscapeSample').controller('CytoscapeCtrl',function($scope, $rootScope){
    // container objects
    $scope.mapData = [];
    $scope.edgeData = [];
    // data types/groups object - used Cytoscape's shapes just to make it more clear
    $scope.objTypes = ['ellipse','triangle','rectangle','roundrectangle','pentagon','octagon','hexagon','heptagon','star'];

    // add object from the form then broadcast event which triggers the directive redrawing of the chart
    // you can pass values and add them without redrawing the entire chart, but this is the simplest way
    $scope.addObj = function(){
        // collecting data from the form
        var newObj = $scope.form.obj.name;
        var newObjType = $scope.form.obj.objTypes;
        // building the new Node object
        // using the array length to generate an id for the sample (you can do it any other way)
        var newNode = {id:'n'+($scope.mapData.length), name:newObj, type:newObjType};
        // adding the new Node to the nodes array
        $scope.mapData.push(newNode);
        // broadcasting the event
        $rootScope.$broadcast('appChanged');
        // resetting the form
        $scope.form.obj = '';
    };

    // add Edges to the edges object, then broadcast the change event
    $scope.addEdge = function(){
        // collecting the data from the form
        var edge1 = $scope.formEdges.fromName.id;
        var edge2 = $scope.formEdges.toName.id;
        // building the new Edge object from the data
        // using the array length to generate an id for the sample (you can do it any other way)
        var newEdge = {id:'e'+($scope.edgeData.length), source: edge1, target: edge2};
        // adding the new edge object to the adges array
        $scope.edgeData.push(newEdge);
        // broadcasting the event
        $rootScope.$broadcast('appChanged');
        // resetting the form
        $scope.formEdges = '';
    };

    // sample function to be called when clicking on an object in the chart
    $scope.doClick = function(value)
    {
        // sample just passes the object's ID then output it to the console and to an alert
        console.debug(value);
        alert(value);
    };

    // reset the sample nodes
    $scope.reset = function(){
        $scope.mapData = [];
        $scope.edgeData = [];
        $rootScope.$broadcast('appChanged');
    }
});