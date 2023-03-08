function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    //console.log(data);
    
    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    var metadata = data.metadata;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var FilterResultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);

    // console.log(FilterResultArray);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var FilterArrayMeta = metadata.filter(sampleObj1 => sampleObj1.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var FilterResultArray2 =FilterResultArray [0];
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var ArrayMeta2 = metadata[0];
    //  console.log(ArrayMeta2);
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds=FilterResultArray2.otu_ids;
    let otuLabels=FilterResultArray2.otu_labels;
    let sampleValues=FilterResultArray2.sample_values;
    // console.log(sampleValues); 
    // console.log(otuLabels); 
    // console.log(otuIds); 
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
     //var washFreq = parseFloat(ArrayMeta2.wfreq);

    let washFreq=ArrayMeta2.wfreq;
    console.log(washFreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last.
    var yticks = otuIds.slice(0, 10).map(otuId => `OTU: ${otuId}`).reverse()
 
      // var yticks = otuIds.sort((a, b) => b - a) 
      //             .slice(0, 10) 
      //              .reverse(); // reverse the order to get the highest number last

console.log(yticks);

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
       x: sampleValues.slice(0, 10).reverse() , 
       y: yticks, 
       type: "bar",
       text: otuLabels.slice(0, 10).reverse(),
       orientation: "h"
  }];


    // Deliverable 1: 9. Create the layout for the bar chart. 
     var barLayout = {
      title: 'Top 10 Bacteria Cultures Per Sample'
     };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleChart = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues,
        colorscale: "Earth"
     }
   };
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: "OTU ID"},
      hovermode: 'closest',
      margin: {t: 50},
    }
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleChart], bubbleLayout);   
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeChart = [{
      domain: {x: [0, 1], y:[0, 1]},
      value: washFreq,
      title: {text: "Bellybutton Washing Frequency<br>Scrubs per week", font: {size:15}},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0, 10]},
        bar: {color: "gray"},
        steps: [
          {range: [0, 2], color:"tomato"},
          {range: [2, 4], color:"coral"},
          {range: [4, 6], color:"yellow"},
          {range: [6, 8], color:"lime"},
          {range: [8, 10], color:"green"}
        ]
      }
    }]
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600, height: 450, margin: {t: 0, b: 0},
      paper_bgcolor: "white",
      font: {color: "black", family: "Arial"}
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeChart, gaugeLayout);
  });
}
