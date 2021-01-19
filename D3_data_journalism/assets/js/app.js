var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 180,
  left: 100
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

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circle labels group
function renderCircleLabels(circleLabelsGroup, newXScale, chosenXAxis) {

  circleLabelsGroup.transition()
    .duration(1000)
    .attr("x", d=> newXScale(d[chosenXAxis]));  

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

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
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

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d[chosenYAxis])])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
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
      return yLinearScale(d[chosenYAxis])+5;
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

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty Rate (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Average Age (years)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Average Income ($)");

  var healthcareLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Health Care Rate (%)");

  var obesityLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 100)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity Rate (%)");

  var smokesLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 120)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smoking Rate (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Average Income ($)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xValue = d3.select(this).attr("value");
      if (xValue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xValue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        circleLabelsGroup = renderCircleLabels(circleLabelsGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Sets classes of all labels to unbold text
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);

        // changes classes of selected label to change to bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);     
        }
        else if (chosenXAxis === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);      
        }
        else if (chosenXAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else if (chosenXAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else if (chosenXAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);      
        }
        else {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});