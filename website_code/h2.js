d3.csv("data/loancleaned_2.csv", function(error, data) {
    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
      this.parentNode.appendChild(this);
      });
    };

  // var loan_status = d3.nest()
  //   .key(function(d){ return d.loan_status_float; })
  //   .map(data);
  // var categories = d3.nest()
  //   .key(function(d){ return d.Category; })
  //   .map(data);
  //console.log(data[0]);
  //console.log(loan_status);
  // Set svg dimensions and append
  var svg_width=1200, svg_height=700;
  var svg = d3.select("#chart2")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Set margins for the histogram portion
  var margin = {
    'top': 10,
    'right': 5,
    'bottom': 35,
    'left': 80
  };

  // Append histogram portion
  var hist = svg.append("g")
  .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");

  var hist_width = svg_width - (margin.left + margin.right),
      hist_height = svg_height - (margin.top + margin.bottom);

  // Scales
  var x_max = 20;
  var x_scale = d3.scale.linear().domain([2,32]).range([0, hist_width]),
      y_scale = d3.scale.linear()
                .domain([0,50])
                .range([hist_height,0]);
      //color_scale = d3.scale.category20().domain({0,1});


  // Axes
  var x_axis = d3.svg.axis().scale(x_scale).orient('bottom'),
      y_axis = d3.svg.axis().scale(y_scale).orient('left').tickFormat(function(d) { return d; });

  // var countries = country_data.map( function(d){ return d['Country']; });
  //       var x_scale = d3.scale.ordinal().domain(countries).rangeBands([0, width], 0.5, 0.25);

  var rectangles =svg.selectAll('circle').data(data);

  rectangles.enter()
      .append('circle')
      .attr('cx', function(d){
        return x_scale(d['int_rate'])+margin.left;
        })
      .attr('cy', function(d){
        return y_scale(d['dti_val'])-margin.top;
      })
      .attr('r', 1.5)
      .attr('fill', function(d) {
        if (d['loan_status_float'] == "1" )
          return '#D95B43';
        else
          return '#5b43d9';
      })
      .style('opacity', 0.6)
      .on('mouseover', function(d) {
                position = d3.mouse(this)
                d3.select(this).style('opacity',.9);
                d3.select(this).transition().attr('r', 2.5)
                d3.select(this).moveToFront();
                d3.select('.tooltip2')
                    .style('visibility','visible')
                    .style('top', d3.event.pageY+10 + 'px')
                    .style('left', d3.event.pageX+10 + 'px')
                    .html('Interest Rate: <strong>'+d['int_rate']+'</strong><br />DTI Ratio: '+d['dti_val']);
            })
            .on('mouseout', function(d) {
                d3.select(this).style('opacity',.6);
                d3.select(this).transition().attr('r', 1.5);
                d3.select('.tooltip2')
                    .style('visibility', 'hidden')
            });

//console.log("bULLSHIT");
  hist.append('g')
    .attr('class', 'axis')
    .attr('id', 'x-axis')
    .call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  
  hist.append('g')
    .attr('class', 'axis')
    .call(y_axis);

  y_text_x = margin.left-55
  var y_text = svg.append('text')
  .attr('x', y_text_x)
  .attr('y', (hist_height/2))
  .attr('text-anchor', 'middle')
  .attr('id', 'yaxis_label')
  .attr('class', 'label')
  .attr('transform','rotate(-90 ' + y_text_x + ' ' + (hist_height/2) + ')')
  .text('Debt to Income Ratio');

  var x_text = svg.append('text')
  .attr('x', hist_width/2)
  .attr('y', hist_height+margin.top+32)
  .attr('text-anchor', 'middle')
  .attr('id', 'xaxis_label')
  .attr('class', 'label')
  .text('Interest Rate');

  // -----------------------------------------------------------------
})