# D3-Challenge

## Link: https://robertjbowen.github.io/D3-Challenge/D3_data_journalism/

<p>
    <img src="https://github.com/robertjbowen/D3-Challenge/blob/main/images/Picture1.png"/>
    <br>
    <em>Display Output Interactive Scatter Plot</em>
</p>

***

The purpose of this challenge is to build an interctive scatter plot of demographic census data showing relationships between population health care rates and other demographic factors. The interactive plot allows the user to chose the variables to be displayed on both the x and y axis and animates a transition of the data points whenever the user selects a different variable to dispaly. The functionality is based on built in D3 functions to import csv data, render the sctterplot based on predetrmined initial variables, and then to transition the rendered table to display user selected variables.

***

### Documents in this repository are:

1. D3_data_journalism/index.html - This is the html code to generate the interactive dashboard web page.(starter code - provided)


2. D3_data_journalism/assets/js directory - Folder containing the javascript project code for automatic table and date search capabilities
	
	* app.js - javasrcipt file containing functions and event triggers to read data.csv, generate the html code to render and transition the plots 


3. D3_data_journalism/assets/data directory - folder containing the data.csv data file (starter code - provided)


4. D3_data_journalism/assets/css directory - folder containing the d3style.css and style.css stlye sheets for styling the appearance of the html output display (starter code - provided)


5. images directory - contains images of the WebPage outputs for display in this ReadMe

***

### Design concept:

The challenge starts by importing and formatting csv data to create an initial chart rendering, it then relies on event listeners to detect user inputs which call functions that transition the display. The code also uses tool tips to display element data for individual data points when the user hovers the mouse over them.

1. The index.html generates an empty shell dashboard with an empty element division with the id 'scatter' within the body of the code. The scatterplot is initialized automatically by app.js by defining the dimensions of the display box, creating a shape vector graphic wrapper, assinging it a variable called 'chartgroup' and appending it to the html at the id  'scatter'. 

<p>
    <img src="https://github.com/robertjbowen/D3-Challenge/blob/main/images/Picture15.png"/>
    <br>
    <em>Excerpt of index.html showing location of appended scatter plot</em>
</p>

<p>
    <img src="https://github.com/robertjbowen/D3-Challenge/blob/main/images/Picture2.png"/>
    <br>
    <em>app.js defining display dimensions and appending chart to index.html</em>
</p>

2. The chartgroup is passed initial display parameters to display poverty rate data on the x-axis and income data on the y-axis.

<p>
    <img src="https://github.com/robertjbowen/D3-Challenge/blob/main/images/Picture16.png"/>
    <br>
    <em>app.js defining initial parameters</em>
</p>

3. The app.js retrieves the csv data and stores it in the variable name censusData. The data is initially imported as character strings os all numeric values are parsed into numeric values.

<p>
    <img src="https://github.com/robertjbowen/D3-Challenge/blob/main/images/Picture7.png"/>
    <br>
    <em>app.js importing csv data and parsing the values to numbers</em>
</p>

4. Once the data is imported, app.js calls functions to generate the x and y axis scales based on the initial display parameters and appends the rendered scales to the chartgroup. The scales are determined by finding the max and min values from the chosen values and increasing adjusting them up or down respectively by 20% to determine the end points of the displayed scale. This step then relies on built-in d3 functions to render the axisBottom and axisLeft for display.

<p>
    <img src="https://github.com/robertjbowen/D3-Challenge/blob/main/images/Picture17.png"/>
    <br>
    <em>app.js calculating and displaying the chart x and y axis</em>
</p>

<p>
    <img src="https://github.com/robertjbowen/D3-Challenge/blob/main/images/Picture3.png"/>
    <br>
    <em>app.js functions to calculate the chart x and y axis scales start and end points</em>
</p>

5. Once the scales are rendered, the app.js creates the axis labels and appends then to the centers of the scales. The axis labels serve a secondary role as the user interface to select which variables to display so a lable for each variable is appended to both scales and set (classed) to being active or inactive. There were 6 variables (poverty, age, income, healthcare, obesity, and smokes) so I chose to add all six to both axis to allow maximum flexibility in how the data can be displayed. Each label is assigned a unique text title and x and y coordinates. The active status causes the selected variable to be displayed in bold text. From the initial values, 'poverty' is automatically selected for the x axis, and 'income' is selected for the y axis. 

<p>
    <img src="https://github.com/robertjbowen/D3-Challenge/blob/main/images/Picture10b.png"/>
    <br>
    <em>app.js creating and appending chart x and y axis labels</em>
</p>

6. 














