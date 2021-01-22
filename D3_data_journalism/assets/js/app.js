var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 180,
  left: 180
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "income";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating x-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis variable upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis variable upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var LeftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(LeftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circle labels group
function renderCircleLabels(circleLabelsGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circleLabelsGroup.transition()
    .duration(1000)
    .attr("x", d=> newXScale(d[chosenXAxis]))
    .attr("y", d=> newYScale(d[chosenYAxis]) + 5);  

  return circleLabelsGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    xlabel = "Age:";
  }
  else if (chosenXAxis === "income") {
    xlabel = "Income:";
  }
  else if (chosenXAxis === "healthcare") {
    xlabel = "Health Care:";
  }
  else if (chosenXAxis === "obesity") {
    xlabel = "Obesity:";
  }
  else {
    xlabel = "Smokes:";
  }

  var ylabel;

  if (chosenYAxis === "poverty") {
    ylabel = "Poverty:";
  }
  else if (chosenYAxis === "age") {
    ylabel = "Age:";
  }
  else if (chosenYAxis === "income") {
    ylabel = "Income:";
  }
  else if (chosenYAxis === "healthcare") {
    ylabel = "Health Care:";
  }
  else if (chosenYAxis === "obesity") {
    ylabel = "Obesity:";
  }
  else {
    ylabel = "Smokes:";
  }

  // formats the display appearance of the tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  // creates tool tip on mouse over event on one of the circles
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // hides tool tip on mouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("/Documents/Bootcamp/D3-Challenge/D3_data_journalism/assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  // parse data into integers
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.age.Moe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });

  // Call functions to calculate x and y chart scales
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "steelblue")
    .attr("opacity", ".5");

	// create circle labels
  var circleLabelsGroup = chartGroup.selectAll(null)
    .data(censusData)
    .enter()
    .append("text");

  circleLabelsGroup
    .attr("x", function(d) {
      return xLinearScale(d[chosenXAxis]);
    })
    .attr("y", function(d) {
      return yLinearScale(d[chosenYAxis]) + 5;
    })
    .text(function(d) {
      return d.abbr;
    })
    .attr("font-family", "arial")
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");  

  // Create group for multiple x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyXLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") 
    .classed("active", true)
    .text("Poverty Rate (%)");

  var ageXLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") 
    .classed("inactive", true)
    .text("Average Age (years)");

  var incomeXLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") 
    .classed("inactive", true)
    .text("Average Income ($)");

  var healthcareXLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "healthcare") 
    .classed("inactive", true)
    .text("Health Care Rate (%)");

  var obesityXLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 100)
    .attr("value", "obesity") 
    .classed("inactive", true)
    .text("Obesity Rate (%)");

  var smokesXLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 120)
    .attr("value", "smokes") 
    .classed("inactive", true)
    .text("Smoking Rate (%)");

// Create group for multiple y-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var povertyYLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -60)
    .attr("value", "poverty") 
    .classed("inactive", true)
    .text("Poverty Rate (%)");

  var ageYLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -80)
    .attr("value", "age") 
    .classed("inactive", true)
    .text("Average Age (years)");

  var incomeYLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -100)
    .attr("value", "income") 
    .classed("active", true)
    .text("Average Income ($)");

  var healthcareYLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -120)
    .attr("value", "healthcare") 
    .classed("inactive", true)
    .text("Health Care Rate (%)");

  var obesityYLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -140)
    .attr("value", "obesity") 
    .classed("inactive", true)
    .text("Obesity Rate (%)");

  var smokesYLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -160)
    .attr("value", "smokes") 
    .classed("inactive", true)
    .text("Smoking Rate (%)");

  // updateToolTip function 
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xValue = d3.select(this).attr("value");
      if (xValue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xValue;

        console.log("Selected X axis: ", chosenXAxis)

        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circleLabelsGroup = renderCircleLabels(circleLabelsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Sets classes of all labels to unbold text
        povertyXLabel
          .classed("active", false)
          .classed("inactive", true);
        ageXLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeXLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareXLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityXLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesXLabel
          .classed("active", false)
          .classed("inactive", true);

        // changes classes of selected label to change to bold text
        if (chosenXAxis === "age") {
          ageXLabel
            .classed("active", true)
            .classed("inactive", false);     
        }
        else if (chosenXAxis === "income") {
          incomeXLabel
            .classed("active", true)
            .classed("inactive", false);      
        }
        else if (chosenXAxis === "healthcare") {
          healthcareXLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else if (chosenXAxis === "obesity") {
          obesityXLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else if (chosenXAxis === "smokes") {
          smokesXLabel
            .classed("active", true)
            .classed("inactive", false);      
        }
        else {
          povertyXLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

    // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yValue = d3.select(this).attr("value");
      if (yValue !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = yValue;

        console.log("Selected Y axis: ", chosenYAxis)

        // updates Y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates Y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new Y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circleLabelsGroup = renderCircleLabels(circleLabelsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Sets classes of all labels to unbold text
        povertyYLabel
          .classed("active", false)
          .classed("inactive", true);
        ageYLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeYLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareYLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityYLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesYLabel
          .classed("active", false)
          .classed("inactive", true);

        // changes classes of selected label to change to bold text
        if (chosenYAxis === "age") {
          ageYLabel
            .classed("active", true)
            .classed("inactive", false);     
        }
        else if (chosenYAxis === "income") {
          incomeYLabel
            .classed("active", true)
            .classed("inactive", false);      
        }
        else if (chosenYAxis === "healthcare") {
          healthcareYLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else if (chosenYAxis === "obesity") {
          obesityYLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else if (chosenYAxis === "smokes") {
          smokesYLabel
            .classed("active", true)
            .classed("inactive", false);      
        }
        else {
          povertyYLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });  
}).catch(function(error) {
  console.log(error);
});